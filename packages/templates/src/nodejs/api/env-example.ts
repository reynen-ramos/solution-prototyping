export const template = `# {{serviceName}} Environment Variables
PORT={{port}}
NODE_ENV=development

{{#if database}}
# Database
DB_HOST={{database.host}}
DB_PORT={{database.port}}
DB_NAME={{database.name}}
DB_USER=postgres
DB_PASSWORD=postgres
{{/if}}

{{#if authentication}}
# Authentication
JWT_SECRET=change-me-in-production-use-a-long-random-string
JWT_EXPIRES_IN=24h
{{/if}}
`;
