export const template = `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
{{#each models}}
from routers.{{nameLower}} import router as {{nameLower}}_router
{{/each}}
{{#if authentication}}
from routers.auth import router as auth_router
{{/if}}

app = FastAPI(title="{{serviceName}}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "{{serviceName}}"}

{{#if authentication}}
app.include_router(auth_router, prefix="{{basePath}}/auth", tags=["auth"])
{{/if}}

{{#each models}}
app.include_router({{nameLower}}_router, prefix="{{../basePath}}/{{namePlural}}", tags=["{{namePlural}}"])
{{/each}}
`;
