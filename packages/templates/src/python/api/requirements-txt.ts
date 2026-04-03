export const template = `fastapi==0.115.0
uvicorn==0.30.0
pydantic==2.8.0
{{#if database}}
sqlalchemy==2.0.31
psycopg2-binary==2.9.9
{{/if}}
{{#if authentication}}
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
{{/if}}
`;
