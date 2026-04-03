export const template = `{
  "name": "{{serviceName}}",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"{{#if authentication}},
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"{{/if}}{{#if database}},
    "pg": "^8.12.0"{{/if}}
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",{{#if authentication}}
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.0",{{/if}}
    "typescript": "^5.5.0",
    "tsx": "^4.0.0"
  }
}`;
