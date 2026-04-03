import { NextResponse } from 'next/server';
import type { GenerationRequest } from '@/types/generation';
import type { DesignDocument, ApiServiceData, DatabaseData, FrontendData } from '@/types/design';
import JSZip from 'jszip';
import {
  generateApiFiles,
  generateDatabaseFiles,
  generateFrontendFiles,
  generateSharedFiles,
  generateDockerCompose,
  generateAwsTerraform,
  mapFieldTypes,
  pluralize,
  type TemplateContext,
  type GeneratedFile,
  type DockerComposeService,
  type ModelDef,
} from '@solution-prototyping/templates';
import {
  generateWithClaude,
  buildApiSystemPrompt,
  buildApiUserPrompt,
  buildFrontendSystemPrompt,
  parseGeneratedFiles,
} from '@/lib/generation/claude-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { design, options } = body as GenerationRequest & { options: GenerationRequest['options'] & { returnJson?: boolean } };

    const files = await generateProject(design, options);

    // Return JSON file list for preview mode
    if (options.returnJson) {
      return NextResponse.json({ files, projectName: design.name });
    }

    // Otherwise return ZIP
    const zip = new JSZip();
    const slug = design.name.toLowerCase().replace(/\s+/g, '-');
    const projectFolder = zip.folder(slug)!;

    for (const file of files) {
      projectFolder.file(file.path, file.content);
    }

    const zipBlob = await zip.generateAsync({ type: 'arraybuffer' });

    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${slug}.zip"`,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}

async function generateProject(
  design: DesignDocument,
  options: GenerationRequest['options'],
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  const dockerServices: DockerComposeService[] = [];

  for (const node of design.nodes) {
    switch (node.data.serviceType) {
      case 'api-service': {
        const config = (node.data as ApiServiceData).config;

        // Find connected database
        const connectedDb = design.edges
          .filter(e => e.source === node.id)
          .map(e => design.nodes.find(n => n.id === e.target))
          .find(n => n?.data.serviceType === 'database');

        const dbConfig = connectedDb ? (connectedDb.data as DatabaseData).config : undefined;

        const models: ModelDef[] = config.models.map(m => ({
          name: m.name,
          nameLower: m.name.toLowerCase(),
          namePlural: pluralize(m.name),
          fields: m.fields.map(f => ({
            name: f.name,
            type: f.type,
            required: f.required,
            ...mapFieldTypes(f.type),
          })),
        }));

        const ctx: TemplateContext = {
          projectName: design.name,
          serviceName: config.serviceName,
          serviceType: 'api-service',
          techStack: config.techStack,
          port: config.port,
          basePath: config.basePath,
          authentication: config.authentication,
          models,
          endpoints: config.endpoints,
          tables: [],
          pages: [],
          connections: design.edges
            .filter(e => e.source === node.id)
            .map(e => {
              const target = design.nodes.find(n => n.id === e.target);
              if (!target) return null;
              return {
                targetServiceName: target.data.label,
                targetServiceType: target.data.serviceType,
                targetPort: getPort(target.data),
              };
            })
            .filter(Boolean) as TemplateContext['connections'],
          database: dbConfig ? {
            engine: dbConfig.engine,
            name: dbConfig.databaseName,
            host: 'database',
            port: dbConfig.port,
          } : undefined,
        };

        // Template-based scaffolding
        files.push(...generateApiFiles(ctx));

        // AI-powered enhancement
        if (options.useAiGeneration && options.claudeApiKey) {
          try {
            const aiOutput = await generateWithClaude(
              options.claudeApiKey,
              buildApiSystemPrompt(config.techStack),
              buildApiUserPrompt(ctx),
            );
            const aiFiles = parseGeneratedFiles(aiOutput, config.serviceName);
            // AI files override template files with same path
            for (const aiFile of aiFiles) {
              const existingIdx = files.findIndex(f => f.path === aiFile.path);
              if (existingIdx >= 0) {
                files[existingIdx] = aiFile;
              } else {
                files.push(aiFile);
              }
            }
          } catch (err) {
            console.error('Claude API error for API service:', err);
            // Continue with template-only output
          }
        }

        // Docker service entry
        const deps: string[] = [];
        if (dbConfig) deps.push('database');
        dockerServices.push({
          name: config.serviceName,
          serviceType: 'api-service',
          techStack: config.techStack,
          port: config.port,
          buildDir: config.serviceName,
          dependsOn: deps,
          environment: [`PORT=${config.port}`],
        });
        break;
      }

      case 'database': {
        const config = (node.data as DatabaseData).config;
        files.push(...generateDatabaseFiles({
          databaseName: config.databaseName,
          engine: config.engine,
          tables: config.tables,
        }));

        const env = config.engine === 'postgresql'
          ? [`POSTGRES_DB=${config.databaseName}`, 'POSTGRES_USER=postgres', 'POSTGRES_PASSWORD=${DB_PASSWORD:-postgres}']
          : ['ACCEPT_EULA=Y', 'SA_PASSWORD=${DB_PASSWORD:-YourStrong!Passw0rd}'];

        dockerServices.push({
          name: 'database',
          serviceType: 'database',
          techStack: config.engine,
          port: config.port,
          buildDir: 'database',
          environment: env,
          volumes: config.engine === 'postgresql' ? ['db-data:/var/lib/postgresql/data'] : [],
        });
        break;
      }

      case 'frontend': {
        const config = (node.data as FrontendData).config;

        // Find connected API
        const connectedApis = design.edges
          .filter(e => e.source === node.id)
          .map(e => design.nodes.find(n => n.id === e.target))
          .filter(n => n?.data.serviceType === 'api-service');

        const apiUrl = connectedApis.length > 0
          ? `http://localhost:${(connectedApis[0]!.data as ApiServiceData).config.port}`
          : 'http://localhost:3001';

        const ctx: TemplateContext & { appName: string; apiUrl: string } = {
          projectName: design.name,
          serviceName: config.appName,
          serviceType: 'frontend',
          techStack: config.framework,
          port: config.port,
          models: [],
          endpoints: [],
          tables: [],
          pages: config.pages,
          connections: [],
          appName: config.appName,
          apiUrl,
          styling: config.styling,
        };

        files.push(...generateFrontendFiles(ctx));

        // AI-powered enhancement for frontend
        if (options.useAiGeneration && options.claudeApiKey) {
          try {
            const prompt = `Generate React components for a frontend app "${config.appName}" with pages: ${config.pages.map(p => `${p.name} (${p.route})`).join(', ')}. Connected API at ${apiUrl}.`;
            const aiOutput = await generateWithClaude(
              options.claudeApiKey,
              buildFrontendSystemPrompt(),
              prompt,
            );
            const aiFiles = parseGeneratedFiles(aiOutput, config.appName);
            for (const aiFile of aiFiles) {
              const existingIdx = files.findIndex(f => f.path === aiFile.path);
              if (existingIdx >= 0) {
                files[existingIdx] = aiFile;
              } else {
                files.push(aiFile);
              }
            }
          } catch (err) {
            console.error('Claude API error for frontend:', err);
          }
        }

        dockerServices.push({
          name: config.appName,
          serviceType: 'frontend',
          techStack: config.framework,
          port: config.port,
          buildDir: config.appName,
        });
        break;
      }
    }
  }

  // Shared files
  files.push(...generateSharedFiles(design.name));

  // Docker compose
  if (options.includeDocker && dockerServices.length > 0) {
    files.push({
      path: 'docker-compose.yml',
      content: generateDockerCompose(dockerServices),
      source: 'template',
    });
  }

  // Infrastructure as Code
  if (options.cloudProvider === 'aws') {
    const terraformServices = dockerServices.map(s => ({
      name: s.name,
      serviceType: s.serviceType,
      techStack: s.techStack,
      port: s.port,
      config: design.nodes.find(n => {
        const cfg = n.data.config as unknown as Record<string, unknown>;
        return cfg && (cfg.serviceName === s.name || cfg.appName === s.name || (s.serviceType === 'database' && n.data.serviceType === 'database'));
      })?.data.config as unknown as Record<string, unknown> || {},
    }));
    files.push(...generateAwsTerraform(design.name, terraformServices));
  }

  // README
  if (options.includeReadme) {
    let readme = `# ${design.name}\n\nGenerated by Solution Prototyping.\n\n## Services\n\n`;
    for (const node of design.nodes) {
      readme += `- **${node.data.label}** (${node.data.serviceType})\n`;
    }
    readme += '\n## Getting Started\n\n```bash\ndocker compose up --build\n```\n';
    if (options.cloudProvider !== 'none') {
      readme += `\n## Deploy to ${options.cloudProvider.toUpperCase()}\n\nSee \`infrastructure/README.md\` for deployment instructions.\n`;
    }
    files.push({ path: 'README.md', content: readme, source: 'template' });
  }

  return files;
}

function getPort(data: { serviceType: string; config?: unknown; [key: string]: unknown }): number {
  const config = data.config as Record<string, unknown> | undefined;
  if (config && typeof config.port === 'number') return config.port;
  return 3000;
}
