import type { TemplateContext, GeneratedFile } from '@solution-prototyping/templates';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateWithClaude(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }] as ClaudeMessage[],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  return textBlock?.text ?? '';
}

export function buildApiSystemPrompt(techStack: string): string {
  const stackGuide: Record<string, string> = {
    nodejs: `Generate Express.js TypeScript code. Use express Router for routes.
Use typed request/response patterns. Include error handling middleware.
Use async/await for database operations.`,
    python: `Generate FastAPI Python code. Use Pydantic models for validation.
Include SQLAlchemy models with async sessions.
Use dependency injection for database connections.`,
    dotnet: `Generate ASP.NET Core 8 Web API C# code. Use controller-based routing.
Include Entity Framework Core DbContext setup. Use DTOs.
Include proper async/await patterns.`,
  };

  return `You are a code generator for a ${techStack} REST API service.
You will receive a service configuration and must generate implementation code.

Return ONLY code files in this exact format (one or more):

\`\`\`filepath:path/to/file.ext
// file contents here
\`\`\`

${stackGuide[techStack] || stackGuide.nodejs}

Rules:
- Use exact model/field names from the configuration
- Generate proper CRUD operations with validation
- Include database connection logic if a database is connected
- Include proper error handling and input validation
- Add type annotations throughout
- Do NOT generate package.json, Dockerfile, or config files`;
}

export function buildApiUserPrompt(ctx: TemplateContext): string {
  let prompt = `Generate implementation code for a ${ctx.techStack} API service called "${ctx.serviceName}" running on port ${ctx.port}.

Base path: ${ctx.basePath || '/api'}
Authentication: ${ctx.authentication ? 'Yes (JWT)' : 'No'}

`;

  if (ctx.models.length > 0) {
    prompt += 'Models:\n';
    for (const model of ctx.models) {
      prompt += `- ${model.name}: ${model.fields.map(f => `${f.name}(${f.type})`).join(', ')}\n`;
    }
    prompt += '\n';
  }

  if (ctx.endpoints.length > 0) {
    prompt += 'Endpoints:\n';
    for (const ep of ctx.endpoints) {
      prompt += `- ${ep.method} ${ep.path}: ${ep.description || 'no description'}\n`;
    }
    prompt += '\n';
  }

  if (ctx.database) {
    prompt += `Connected database: ${ctx.database.engine} at ${ctx.database.host}:${ctx.database.port}/${ctx.database.name}\n`;
  }

  if (ctx.connections.length > 0) {
    prompt += 'Connected services:\n';
    for (const conn of ctx.connections) {
      prompt += `- ${conn.targetServiceName} (${conn.targetServiceType}) on port ${conn.targetPort}\n`;
    }
  }

  return prompt;
}

export function buildFrontendSystemPrompt(): string {
  return `You are a code generator for a React TypeScript frontend application.
You will receive a frontend configuration with pages and connected APIs.

Return ONLY code files in this exact format:

\`\`\`filepath:path/to/file.ext
// file contents here
\`\`\`

Rules:
- Generate React functional components with hooks
- Use fetch for API calls with proper error handling
- Include loading and error states
- Create a clean, usable UI with inline styles
- Generate separate components for each page
- Include an API client module
- Do NOT generate package.json, vite.config, or main.tsx`;
}

export function parseGeneratedFiles(output: string, baseDir: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const regex = /```filepath:(.+?)\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(output)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim() + '\n';
    files.push({
      path: `${baseDir}/${filePath}`,
      content,
      source: 'ai',
    });
  }

  return files;
}
