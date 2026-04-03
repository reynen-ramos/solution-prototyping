import type { ServiceType } from '@/types/service-types';

interface ConnectionRule {
  from: ServiceType;
  to: ServiceType[];
  description: string;
}

const connectionRules: ConnectionRule[] = [
  {
    from: 'frontend',
    to: ['api-service', 'auth-service', 'serverless', 'storage'],
    description: 'Frontend connects to APIs, auth, functions, or storage',
  },
  {
    from: 'api-service',
    to: ['database', 'auth-service', 'message-queue', 'storage', 'serverless', 'api-service'],
    description: 'API connects to databases, auth, queues, storage, functions, or other APIs',
  },
  {
    from: 'auth-service',
    to: ['database'],
    description: 'Auth service connects to a database for user storage',
  },
  {
    from: 'serverless',
    to: ['database', 'message-queue', 'storage', 'api-service'],
    description: 'Functions connect to databases, queues, storage, or APIs',
  },
  {
    from: 'message-queue',
    to: [],
    description: 'Message queue is a target, not a source',
  },
  {
    from: 'database',
    to: [],
    description: 'Database is a target, not a source',
  },
  {
    from: 'storage',
    to: [],
    description: 'Storage is a target, not a source',
  },
];

export function canConnect(sourceType: ServiceType, targetType: ServiceType): boolean {
  if (sourceType === targetType && sourceType !== 'api-service') return false;
  const rule = connectionRules.find(r => r.from === sourceType);
  if (!rule) return true; // allow by default if no rule defined
  return rule.to.includes(targetType);
}

export function getConnectionError(sourceType: ServiceType, targetType: ServiceType): string | null {
  if (canConnect(sourceType, targetType)) return null;

  const rule = connectionRules.find(r => r.from === sourceType);
  if (rule && rule.to.length === 0) {
    return `${formatType(sourceType)} cannot be a connection source`;
  }
  return `${formatType(sourceType)} cannot connect to ${formatType(targetType)}`;
}

function formatType(type: ServiceType): string {
  return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
