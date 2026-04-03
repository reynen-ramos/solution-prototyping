import Handlebars from 'handlebars';
import { registerHelpers } from './helpers';
import type { TemplateContext, GeneratedFile, ModelDef } from './types';

// Node.js templates
import { template as nodejsPackageJson } from './nodejs/api/package-json';
import { template as nodejsIndexTs } from './nodejs/api/index-ts';
import { template as nodejsRouteTs } from './nodejs/api/route-ts';
import { template as nodejsModelTs } from './nodejs/api/model-ts';
import { template as nodejsAuthMiddleware } from './nodejs/api/auth-middleware-ts';
import { template as nodejsAuthRoute } from './nodejs/api/auth-route-ts';
import { template as nodejsDbTs } from './nodejs/api/db-ts';
import { template as nodejsErrorHandler } from './nodejs/api/error-handler-ts';
import { template as nodejsRouteWithDbTs } from './nodejs/api/route-with-db-ts';
import { template as nodejsEnvExample } from './nodejs/api/env-example';

// Python templates
import { template as pythonMainPy } from './python/api/main-py';
import { template as pythonRequirementsTxt } from './python/api/requirements-txt';
import { template as pythonRouterPy } from './python/api/router-py';

// .NET templates
import { template as dotnetProgramCs } from './dotnet/api/program-cs';
import { template as dotnetCsproj } from './dotnet/api/csproj';
import { template as dotnetControllerCs } from './dotnet/api/controller-cs';

// Database templates
import { template as schemaSQL } from './database/schema-sql';

// React templates
import { template as reactAppTsx } from './react/app-tsx';
import { template as reactPackageJson } from './react/package-json';
import { appCss as reactAppCss } from './react/app-css';
import { template as reactApiClient } from './react/api-client-ts';

// Shared
import {
  nodejsDockerfile,
  pythonDockerfile,
  dotnetDockerfile,
  reactDockerfile,
  postgresDockerfile,
  sqlserverDockerfile,
} from './shared/dockerfile';
import { nodejsTsconfig } from './shared/tsconfig';
import { generateDockerCompose, type DockerComposeService } from './shared/docker-compose';
import { generateAwsTerraform } from './terraform/aws';

export type { TemplateContext, GeneratedFile, ModelDef, DockerComposeService };
export { generateDockerCompose, generateAwsTerraform };
export type { FieldDef, EndpointDef, TableDef, ColumnDef, PageDef, ConnectionDef } from './types';

// Initialize helpers once
let initialized = false;
function ensureInit() {
  if (!initialized) {
    registerHelpers();
    initialized = true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function render(templateStr: string, context: any): string {
  ensureInit();
  const compiled = Handlebars.compile(templateStr, { noEscape: true });
  return compiled(context);
}

export function generateApiFiles(ctx: TemplateContext): GeneratedFile[] {
  const dir = ctx.serviceName;
  const files: GeneratedFile[] = [];

  switch (ctx.techStack) {
    case 'nodejs': {
      files.push({ path: `${dir}/package.json`, content: render(nodejsPackageJson, ctx), source: 'template' });
      files.push({ path: `${dir}/tsconfig.json`, content: nodejsTsconfig, source: 'template' });
      files.push({ path: `${dir}/src/index.ts`, content: render(nodejsIndexTs, ctx), source: 'template' });
      files.push({ path: `${dir}/Dockerfile`, content: render(nodejsDockerfile, ctx), source: 'template' });
      files.push({ path: `${dir}/src/middleware/error-handler.ts`, content: render(nodejsErrorHandler, ctx), source: 'template' });
      files.push({ path: `${dir}/.env.example`, content: render(nodejsEnvExample, ctx), source: 'template' });

      if (ctx.database) {
        files.push({ path: `${dir}/src/db.ts`, content: render(nodejsDbTs, ctx), source: 'template' });
      }

      if (ctx.authentication) {
        files.push({ path: `${dir}/src/middleware/auth.ts`, content: render(nodejsAuthMiddleware, ctx), source: 'template' });
        files.push({ path: `${dir}/src/routes/auth.ts`, content: render(nodejsAuthRoute, ctx), source: 'template' });
      }

      // Use DB-aware routes when connected to a database, otherwise in-memory
      const routeTemplate = ctx.database ? nodejsRouteWithDbTs : nodejsRouteTs;
      for (const model of ctx.models) {
        const modelCtx = { ...ctx, ...model };
        files.push({ path: `${dir}/src/routes/${model.nameLower}.ts`, content: render(routeTemplate, modelCtx), source: 'template' });
        files.push({ path: `${dir}/src/models/${model.nameLower}.ts`, content: render(nodejsModelTs, modelCtx), source: 'template' });
      }
      break;
    }
    case 'python': {
      files.push({ path: `${dir}/requirements.txt`, content: render(pythonRequirementsTxt, ctx), source: 'template' });
      files.push({ path: `${dir}/main.py`, content: render(pythonMainPy, ctx), source: 'template' });
      files.push({ path: `${dir}/Dockerfile`, content: render(pythonDockerfile, ctx), source: 'template' });

      for (const model of ctx.models) {
        const modelCtx = { ...ctx, ...model };
        files.push({ path: `${dir}/routers/${model.nameLower}.py`, content: render(pythonRouterPy, modelCtx), source: 'template' });
      }
      break;
    }
    case 'dotnet': {
      files.push({ path: `${dir}/${ctx.serviceName}.csproj`, content: render(dotnetCsproj, ctx), source: 'template' });
      files.push({ path: `${dir}/Program.cs`, content: render(dotnetProgramCs, ctx), source: 'template' });
      files.push({ path: `${dir}/Dockerfile`, content: render(dotnetDockerfile, ctx), source: 'template' });

      for (const model of ctx.models) {
        const modelCtx = { ...ctx, ...model };
        files.push({ path: `${dir}/Controllers/${model.name}Controller.cs`, content: render(dotnetControllerCs, modelCtx), source: 'template' });
      }
      break;
    }
  }

  return files;
}

export function generateDatabaseFiles(ctx: {
  databaseName: string;
  engine: string;
  tables: { name: string; columns: { name: string; type: string; primaryKey: boolean; nullable: boolean; defaultValue?: string }[] }[];
}): GeneratedFile[] {
  const dir = 'database';
  const files: GeneratedFile[] = [];

  files.push({ path: `${dir}/schema.sql`, content: render(schemaSQL, ctx), source: 'template' });

  const dockerfile = ctx.engine === 'postgresql' ? postgresDockerfile : sqlserverDockerfile;
  files.push({ path: `${dir}/Dockerfile`, content: dockerfile, source: 'template' });

  return files;
}

export function generateFrontendFiles(ctx: TemplateContext & { appName: string; apiUrl: string }): GeneratedFile[] {
  const dir = ctx.appName;
  const files: GeneratedFile[] = [];

  files.push({ path: `${dir}/package.json`, content: render(reactPackageJson, ctx), source: 'template' });
  files.push({ path: `${dir}/src/App.tsx`, content: render(reactAppTsx, ctx), source: 'template' });
  files.push({ path: `${dir}/src/App.css`, content: reactAppCss, source: 'template' });
  files.push({ path: `${dir}/Dockerfile`, content: reactDockerfile, source: 'template' });

  // Generate typed API client if there are models
  if (ctx.models && ctx.models.length > 0) {
    files.push({ path: `${dir}/src/api-client.ts`, content: render(reactApiClient, ctx), source: 'template' });
  }

  files.push({
    path: `${dir}/index.html`,
    content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${ctx.appName}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`,
    source: 'template',
  });

  files.push({
    path: `${dir}/src/main.tsx`,
    content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`,
    source: 'template',
  });

  files.push({
    path: `${dir}/vite.config.ts`,
    content: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: ${ctx.port} },\n});\n`,
    source: 'template',
  });

  return files;
}

export function generateSharedFiles(projectName: string): GeneratedFile[] {
  return [
    {
      path: '.gitignore',
      content: 'node_modules/\n.env\ndist/\nbuild/\n.next/\n*.log\n__pycache__/\n*.pyc\nbin/\nobj/\n',
      source: 'template',
    },
    {
      path: '.env.example',
      content: '# Environment Variables\nDB_PASSWORD=postgres\nJWT_SECRET=change-me-in-production\n',
      source: 'template',
    },
  ];
}

// Type mapping utilities
export function mapFieldTypes(type: string): { tsType: string; pyType: string; csType: string; sqlType: string } {
  switch (type) {
    case 'number':
      return { tsType: 'number', pyType: 'float', csType: 'double', sqlType: 'DECIMAL' };
    case 'boolean':
      return { tsType: 'boolean', pyType: 'bool', csType: 'bool', sqlType: 'BOOLEAN' };
    case 'Date':
      return { tsType: 'string', pyType: 'str', csType: 'DateTime', sqlType: 'TIMESTAMP' };
    default:
      return { tsType: 'string', pyType: 'str', csType: 'string', sqlType: 'VARCHAR(255)' };
  }
}

export function pluralize(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('s')) return lower;
  if (lower.endsWith('y')) return lower.slice(0, -1) + 'ies';
  return lower + 's';
}
