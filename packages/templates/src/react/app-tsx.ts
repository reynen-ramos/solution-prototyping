export const template = `import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '{{apiUrl}}';

{{#each pages}}
function {{pascalCase name}}Page() {
  return (
    <div>
      <h2>{{name}}</h2>
      <p>{{description}}</p>
    </div>
  );
}

{{/each}}
function App() {
  const [health, setHealth] = useState<string>('checking...');
  const [currentPage, setCurrentPage] = useState<string>('{{#if pages}}{{pages.0.route}}{{else}}/{{/if}}');

  useEffect(() => {
    fetch(\`\${API_URL}/health\`)
      .then(r => r.json())
      .then(d => setHealth(d.status))
      .catch(() => setHealth('offline'));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1>{{appName}}</h1>
        <p style={{ color: '#6b7280' }}>API Status: <span style={{ color: health === 'ok' ? '#10b981' : '#ef4444' }}>{health}</span></p>
      </header>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
{{#each pages}}
        <button
          onClick={() => setCurrentPage('{{route}}')}
          style={{
            padding: '0.5rem 1rem',
            border: currentPage === '{{route}}' ? '2px solid #3b82f6' : '1px solid #d1d5db',
            borderRadius: '0.375rem',
            background: currentPage === '{{route}}' ? '#eff6ff' : 'white',
            cursor: 'pointer',
          }}
        >
          {{name}}
        </button>
{{/each}}
      </nav>
      <main>
{{#each pages}}
        {currentPage === '{{route}}' && <{{pascalCase name}}Page />}
{{/each}}
      </main>
    </div>
  );
}

export default App;
`;
