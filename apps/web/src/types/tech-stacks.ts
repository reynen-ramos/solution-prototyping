import type {
  ServiceType,
  ApiTechStack,
  DatabaseEngine,
  FrontendFramework,
  ApiServiceConfig,
  DatabaseConfig,
  FrontendConfig,
} from './service-types';

export interface TechStackOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const API_TECH_STACKS: Record<ApiTechStack, TechStackOption> = {
  dotnet: {
    id: 'dotnet',
    label: '.NET 8',
    description: 'ASP.NET Core Web API with Entity Framework',
    icon: 'dotnet',
  },
  nodejs: {
    id: 'nodejs',
    label: 'Node.js',
    description: 'Express.js with TypeScript and Prisma',
    icon: 'nodejs',
  },
  python: {
    id: 'python',
    label: 'Python',
    description: 'FastAPI with SQLAlchemy',
    icon: 'python',
  },
};

export const DATABASE_ENGINES: Record<DatabaseEngine, TechStackOption> = {
  postgresql: {
    id: 'postgresql',
    label: 'PostgreSQL',
    description: 'Open-source relational database',
    icon: 'postgresql',
  },
  sqlserver: {
    id: 'sqlserver',
    label: 'SQL Server',
    description: 'Microsoft SQL Server',
    icon: 'sqlserver',
  },
};

export const FRONTEND_FRAMEWORKS: Record<FrontendFramework, TechStackOption> = {
  react: {
    id: 'react',
    label: 'React',
    description: 'React with Vite and TypeScript',
    icon: 'react',
  },
};

export function getDefaultConfig(serviceType: ServiceType) {
  switch (serviceType) {
    case 'api-service':
      return {
        techStack: 'nodejs' as const,
        serviceName: 'api-service',
        port: 3001,
        basePath: '/api',
        endpoints: [],
        models: [],
        authentication: false,
      };
    case 'database':
      return {
        engine: 'postgresql' as const,
        databaseName: 'app_db',
        port: 5432,
        tables: [],
        seedData: false,
      };
    case 'frontend':
      return {
        framework: 'react' as const,
        appName: 'web-app',
        port: 5173,
        pages: [{ name: 'Home', route: '/', description: 'Landing page' }],
        styling: 'tailwind' as const,
      };
    case 'auth-service':
      return {
        provider: 'jwt' as const,
        serviceName: 'auth-service',
        port: 3002,
        enableRegistration: true,
        enablePasswordReset: false,
        sessionDuration: '24h',
      };
    case 'message-queue':
      return {
        engine: 'rabbitmq' as const,
        serviceName: 'message-queue',
        port: 5672,
        topics: [],
      };
    case 'storage':
      return {
        provider: 's3' as const,
        serviceName: 'storage',
        buckets: [{ name: 'uploads', public: false }],
        maxFileSizeMb: 10,
      };
    case 'serverless':
      return {
        runtime: 'nodejs' as const,
        serviceName: 'functions',
        functions: [],
      };
  }
}
