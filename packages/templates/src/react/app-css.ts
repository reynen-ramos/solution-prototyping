export const appCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; color: #1f2937; background: #f9fafb; }
.app { max-width: 960px; margin: 0 auto; padding: 2rem; }
.app-header { border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 2rem; }
.app-header h1 { font-size: 1.5rem; font-weight: 700; }
.status { color: #6b7280; margin-top: 0.25rem; font-size: 0.875rem; }
.status-ok { color: #10b981; font-weight: 600; }
.status-error { color: #ef4444; font-weight: 600; }
.app-nav { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
.nav-btn { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; cursor: pointer; font-size: 0.875rem; transition: all 0.15s; }
.nav-btn:hover { border-color: #93c5fd; background: #f0f9ff; }
.nav-btn.active { border: 2px solid #3b82f6; background: #eff6ff; font-weight: 600; }
.page { padding: 1rem 0; }
.page h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
.page p { color: #6b7280; }
`;
