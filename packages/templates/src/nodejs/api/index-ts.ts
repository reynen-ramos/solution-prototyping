export const template = `import express from 'express';
import cors from 'cors';
{{#each models}}
import { {{nameLower}}Router } from './routes/{{nameLower}}';
{{/each}}
{{#if authentication}}
import { authRouter } from './routes/auth';
import { authMiddleware } from './middleware/auth';
{{/if}}

const app = express();
const PORT = process.env.PORT || {{port}};

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: '{{serviceName}}' });
});

{{#if authentication}}
app.use('{{basePath}}/auth', authRouter);
{{/if}}

{{#each models}}
app.use('{{../basePath}}/{{namePlural}}', {{#if ../authentication}}authMiddleware, {{/if}}{{nameLower}}Router);
{{/each}}

app.listen(PORT, () => {
  console.log(\`{{serviceName}} running on port \${PORT}\`);
});
`;
