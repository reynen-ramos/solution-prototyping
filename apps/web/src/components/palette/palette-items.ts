import type { ServiceType } from '@/types/service-types';

export interface PaletteItemDef {
  serviceType: ServiceType;
  label: string;
  description: string;
  iconName: string;
  category: 'core' | 'infrastructure' | 'compute';
}

export const paletteItems: PaletteItemDef[] = [
  // Core
  {
    serviceType: 'api-service',
    label: 'API Service',
    description: 'REST API backend service',
    iconName: 'server',
    category: 'core',
  },
  {
    serviceType: 'database',
    label: 'Database',
    description: 'SQL database (PostgreSQL/SQL Server)',
    iconName: 'database',
    category: 'core',
  },
  {
    serviceType: 'frontend',
    label: 'Frontend',
    description: 'Web frontend application',
    iconName: 'monitor',
    category: 'core',
  },
  // Infrastructure
  {
    serviceType: 'auth-service',
    label: 'Auth Service',
    description: 'Authentication & authorization',
    iconName: 'shield',
    category: 'infrastructure',
  },
  {
    serviceType: 'message-queue',
    label: 'Message Queue',
    description: 'Async messaging (RabbitMQ/Kafka)',
    iconName: 'messages-square',
    category: 'infrastructure',
  },
  {
    serviceType: 'storage',
    label: 'Storage',
    description: 'File/blob storage (S3/Azure)',
    iconName: 'hard-drive',
    category: 'infrastructure',
  },
  // Compute
  {
    serviceType: 'serverless',
    label: 'Serverless',
    description: 'Serverless functions (Lambda)',
    iconName: 'zap',
    category: 'compute',
  },
];
