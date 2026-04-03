export const template = `const API_URL = import.meta.env.VITE_API_URL || '{{apiUrl}}';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = \`\${API_URL}\${path}\`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || \`HTTP \${res.status}\`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) =>
    request(path, { method: 'DELETE' }),
};

export async function checkHealth(): Promise<{ status: string; service: string }> {
  return api.get('/health');
}
{{#each models}}

// {{name}} API
export interface {{name}} {
  id: string;
{{#each fields}}
  {{name}}: {{tsType}};
{{/each}}
}

export type Create{{name}} = Omit<{{name}}, 'id'>;

export const {{nameLower}}Api = {
  list: () => api.get<{{name}}[]>('{{../basePath}}/{{namePlural}}'),
  get: (id: string) => api.get<{{name}}>(\`{{../basePath}}/{{namePlural}}/\${id}\`),
  create: (data: Create{{name}}) => api.post<{{name}}>('{{../basePath}}/{{namePlural}}', data),
  update: (id: string, data: Partial<Create{{name}}>) => api.put<{{name}}>(\`{{../basePath}}/{{namePlural}}/\${id}\`, data),
  delete: (id: string) => api.delete(\`{{../basePath}}/{{namePlural}}/\${id}\`),
};
{{/each}}
`;
