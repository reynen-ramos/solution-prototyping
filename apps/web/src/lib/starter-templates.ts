import type { DesignDocument } from '@/types/design';

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  icon: string;
  design: DesignDocument;
}

export const starterTemplates: StarterTemplate[] = [
  {
    id: 'saas-starter',
    name: 'SaaS Starter',
    description: 'React frontend, Node.js API with auth, PostgreSQL database',
    tags: ['fullstack', 'auth', 'postgresql'],
    icon: 'rocket',
    design: {
      id: 'tpl-saas',
      name: 'SaaS Starter',
      version: '1',
      viewport: { x: 0, y: 0, zoom: 0.85 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: 'frontend-1',
          type: 'frontend',
          position: { x: 0, y: 100 },
          data: {
            label: 'Web App',
            description: 'React SPA with Tailwind',
            serviceType: 'frontend',
            config: {
              framework: 'react',
              appName: 'web-app',
              port: 5173,
              pages: [
                { name: 'Home', route: '/', description: 'Landing page' },
                { name: 'Dashboard', route: '/dashboard', description: 'User dashboard' },
                { name: 'Login', route: '/login', description: 'Authentication' },
                { name: 'Settings', route: '/settings', description: 'User settings' },
              ],
              styling: 'tailwind',
            },
          },
        },
        {
          id: 'api-1',
          type: 'api-service',
          position: { x: 400, y: 50 },
          data: {
            label: 'API Service',
            description: 'Main backend API',
            serviceType: 'api-service',
            config: {
              techStack: 'nodejs',
              serviceName: 'api-service',
              port: 3001,
              basePath: '/api',
              authentication: true,
              endpoints: [
                { method: 'GET', path: '/users', description: 'List users' },
                { method: 'GET', path: '/users/:id', description: 'Get user by ID' },
                { method: 'POST', path: '/users', description: 'Create user' },
                { method: 'PUT', path: '/users/:id', description: 'Update user' },
              ],
              models: [
                {
                  name: 'User',
                  fields: [
                    { name: 'email', type: 'string', required: true, description: 'Email address' },
                    { name: 'name', type: 'string', required: true, description: 'Full name' },
                    { name: 'role', type: 'string', required: false, description: 'User role' },
                  ],
                },
              ],
            },
          },
        },
        {
          id: 'db-1',
          type: 'database',
          position: { x: 800, y: 100 },
          data: {
            label: 'PostgreSQL',
            description: 'Primary database',
            serviceType: 'database',
            config: {
              engine: 'postgresql',
              databaseName: 'saas_db',
              port: 5432,
              tables: [
                {
                  name: 'users',
                  columns: [
                    { name: 'id', type: 'uuid', primaryKey: true, nullable: false, defaultValue: 'gen_random_uuid()' },
                    { name: 'email', type: 'varchar', primaryKey: false, nullable: false },
                    { name: 'name', type: 'varchar', primaryKey: false, nullable: false },
                    { name: 'role', type: 'varchar', primaryKey: false, nullable: true },
                    { name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, defaultValue: 'now()' },
                  ],
                },
              ],
              seedData: true,
            },
          },
        },
      ],
      edges: [
        { id: 'e-fe-api', source: 'frontend-1', target: 'api-1', type: 'connection', data: { label: 'REST', connectionType: 'frontend-to-api', description: 'HTTP/JSON' } },
        { id: 'e-api-db', source: 'api-1', target: 'db-1', type: 'connection', data: { label: 'SQL', connectionType: 'api-to-db', description: 'PostgreSQL connection' } },
      ],
    },
  },
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'Multiple APIs with message queue, shared database, and frontend',
    tags: ['microservices', 'queue', 'scalable'],
    icon: 'boxes',
    design: {
      id: 'tpl-micro',
      name: 'Microservices',
      version: '1',
      viewport: { x: 0, y: 0, zoom: 0.75 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: 'frontend-1',
          type: 'frontend',
          position: { x: 0, y: 150 },
          data: {
            label: 'Web App', description: 'Frontend gateway', serviceType: 'frontend',
            config: { framework: 'react', appName: 'web-app', port: 5173, pages: [{ name: 'Home', route: '/', description: 'Main page' }], styling: 'tailwind' },
          },
        },
        {
          id: 'api-users',
          type: 'api-service',
          position: { x: 400, y: 0 },
          data: {
            label: 'User Service', description: 'User management', serviceType: 'api-service',
            config: {
              techStack: 'nodejs', serviceName: 'user-service', port: 3001, basePath: '/api', authentication: true, endpoints: [],
              models: [{ name: 'User', fields: [{ name: 'email', type: 'string', required: true, description: '' }, { name: 'name', type: 'string', required: true, description: '' }] }],
            },
          },
        },
        {
          id: 'api-orders',
          type: 'api-service',
          position: { x: 400, y: 200 },
          data: {
            label: 'Order Service', description: 'Order processing', serviceType: 'api-service',
            config: {
              techStack: 'nodejs', serviceName: 'order-service', port: 3002, basePath: '/api', authentication: false, endpoints: [],
              models: [{ name: 'Order', fields: [{ name: 'userId', type: 'string', required: true, description: '' }, { name: 'total', type: 'number', required: true, description: '' }, { name: 'status', type: 'string', required: true, description: '' }] }],
            },
          },
        },
        {
          id: 'queue-1',
          type: 'message-queue',
          position: { x: 400, y: 400 },
          data: {
            label: 'Message Queue', description: 'Event bus', serviceType: 'message-queue',
            config: { engine: 'rabbitmq', serviceName: 'message-queue', port: 5672, topics: [{ name: 'order.created', description: 'New order event' }, { name: 'user.registered', description: 'New user event' }] },
          },
        },
        {
          id: 'db-1',
          type: 'database',
          position: { x: 800, y: 100 },
          data: {
            label: 'PostgreSQL', description: 'Shared database', serviceType: 'database',
            config: { engine: 'postgresql', databaseName: 'microservices_db', port: 5432, tables: [], seedData: false },
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'frontend-1', target: 'api-users', type: 'connection', data: { label: 'REST', connectionType: 'frontend-to-api', description: '' } },
        { id: 'e2', source: 'frontend-1', target: 'api-orders', type: 'connection', data: { label: 'REST', connectionType: 'frontend-to-api', description: '' } },
        { id: 'e3', source: 'api-users', target: 'db-1', type: 'connection', data: { label: 'SQL', connectionType: 'api-to-db', description: '' } },
        { id: 'e4', source: 'api-orders', target: 'db-1', type: 'connection', data: { label: 'SQL', connectionType: 'api-to-db', description: '' } },
        { id: 'e5', source: 'api-orders', target: 'queue-1', type: 'connection', data: { label: 'Publish', connectionType: 'custom', description: '' } },
      ],
    },
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Storefront with API, database, file storage, and payment queue',
    tags: ['ecommerce', 'storage', 'fullstack'],
    icon: 'shopping-cart',
    design: {
      id: 'tpl-ecom',
      name: 'E-Commerce',
      version: '1',
      viewport: { x: 0, y: 0, zoom: 0.75 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: 'frontend-1',
          type: 'frontend',
          position: { x: 0, y: 150 },
          data: {
            label: 'Storefront', description: 'Customer-facing shop', serviceType: 'frontend',
            config: {
              framework: 'react', appName: 'storefront', port: 5173, styling: 'tailwind',
              pages: [{ name: 'Products', route: '/', description: 'Product listing' }, { name: 'Cart', route: '/cart', description: 'Shopping cart' }, { name: 'Checkout', route: '/checkout', description: 'Payment flow' }],
            },
          },
        },
        {
          id: 'api-1',
          type: 'api-service',
          position: { x: 400, y: 50 },
          data: {
            label: 'Store API', description: 'Product and order API', serviceType: 'api-service',
            config: {
              techStack: 'python', serviceName: 'store-api', port: 8000, basePath: '/api', authentication: true, endpoints: [],
              models: [
                { name: 'Product', fields: [{ name: 'title', type: 'string', required: true, description: '' }, { name: 'price', type: 'number', required: true, description: '' }, { name: 'imageUrl', type: 'string', required: false, description: '' }] },
                { name: 'Order', fields: [{ name: 'userId', type: 'string', required: true, description: '' }, { name: 'total', type: 'number', required: true, description: '' }, { name: 'status', type: 'string', required: true, description: '' }] },
              ],
            },
          },
        },
        {
          id: 'db-1',
          type: 'database',
          position: { x: 800, y: 0 },
          data: {
            label: 'PostgreSQL', description: 'Products & orders', serviceType: 'database',
            config: { engine: 'postgresql', databaseName: 'ecommerce_db', port: 5432, tables: [], seedData: true },
          },
        },
        {
          id: 'storage-1',
          type: 'storage',
          position: { x: 800, y: 200 },
          data: {
            label: 'Media Storage', description: 'Product images', serviceType: 'storage',
            config: { provider: 's3', serviceName: 'media-storage', buckets: [{ name: 'product-images', public: true }], maxFileSizeMb: 5 },
          },
        },
        {
          id: 'queue-1',
          type: 'message-queue',
          position: { x: 400, y: 300 },
          data: {
            label: 'Payment Queue', description: 'Async payment processing', serviceType: 'message-queue',
            config: { engine: 'rabbitmq', serviceName: 'payment-queue', port: 5672, topics: [{ name: 'payment.process', description: 'Process payment' }] },
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'frontend-1', target: 'api-1', type: 'connection', data: { label: 'REST', connectionType: 'frontend-to-api', description: '' } },
        { id: 'e2', source: 'api-1', target: 'db-1', type: 'connection', data: { label: 'SQL', connectionType: 'api-to-db', description: '' } },
        { id: 'e3', source: 'api-1', target: 'storage-1', type: 'connection', data: { label: 'Upload', connectionType: 'custom', description: '' } },
        { id: 'e4', source: 'api-1', target: 'queue-1', type: 'connection', data: { label: 'Publish', connectionType: 'custom', description: '' } },
      ],
    },
  },
  {
    id: 'dotnet-api',
    name: '.NET Web API',
    description: 'ASP.NET Core 8 API with SQL Server and React frontend',
    tags: ['dotnet', 'sqlserver', 'enterprise'],
    icon: 'building',
    design: {
      id: 'tpl-dotnet',
      name: '.NET Web API',
      version: '1',
      viewport: { x: 0, y: 0, zoom: 0.85 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: 'frontend-1',
          type: 'frontend',
          position: { x: 0, y: 80 },
          data: {
            label: 'Web App', description: 'React SPA', serviceType: 'frontend',
            config: { framework: 'react', appName: 'web-app', port: 5173, pages: [{ name: 'Home', route: '/', description: 'Main page' }, { name: 'Admin', route: '/admin', description: 'Admin panel' }], styling: 'tailwind' },
          },
        },
        {
          id: 'api-1',
          type: 'api-service',
          position: { x: 400, y: 80 },
          data: {
            label: '.NET API', description: 'ASP.NET Core 8 Web API', serviceType: 'api-service',
            config: {
              techStack: 'dotnet', serviceName: 'dotnet-api', port: 5000, basePath: '/api', authentication: true, endpoints: [],
              models: [{ name: 'Item', fields: [{ name: 'title', type: 'string', required: true, description: '' }, { name: 'description', type: 'string', required: false, description: '' }, { name: 'isComplete', type: 'boolean', required: false, description: '' }] }],
            },
          },
        },
        {
          id: 'db-1',
          type: 'database',
          position: { x: 800, y: 80 },
          data: {
            label: 'SQL Server', description: 'Enterprise database', serviceType: 'database',
            config: { engine: 'sqlserver', databaseName: 'AppDb', port: 1433, tables: [], seedData: false },
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'frontend-1', target: 'api-1', type: 'connection', data: { label: 'REST', connectionType: 'frontend-to-api', description: '' } },
        { id: 'e2', source: 'api-1', target: 'db-1', type: 'connection', data: { label: 'EF Core', connectionType: 'api-to-db', description: '' } },
      ],
    },
  },
];
