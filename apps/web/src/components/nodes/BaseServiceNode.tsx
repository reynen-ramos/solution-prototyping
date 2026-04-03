'use client';

import { Handle, Position } from '@xyflow/react';
import type { ServiceNodeData } from '@/types/design';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Server, Database, Monitor, Shield, MessagesSquare, HardDrive, Zap } from 'lucide-react';

function getNodeIcon(serviceType: string) {
  switch (serviceType) {
    case 'api-service': return <Server className="h-4 w-4" />;
    case 'database': return <Database className="h-4 w-4" />;
    case 'frontend': return <Monitor className="h-4 w-4" />;
    case 'auth-service': return <Shield className="h-4 w-4" />;
    case 'message-queue': return <MessagesSquare className="h-4 w-4" />;
    case 'storage': return <HardDrive className="h-4 w-4" />;
    case 'serverless': return <Zap className="h-4 w-4" />;
    default: return <Server className="h-4 w-4" />;
  }
}

function getTechLabel(data: ServiceNodeData): string {
  const config = data.config as unknown as Record<string, unknown>;
  if ('techStack' in config) return String(config.techStack).toUpperCase();
  if ('engine' in config) return String(config.engine);
  if ('framework' in config) return String(config.framework);
  if ('provider' in config) return String(config.provider).toUpperCase();
  if ('runtime' in config) return String(config.runtime).toUpperCase();
  return data.serviceType;
}

function getNodeColorClass(serviceType: string): string {
  switch (serviceType) {
    case 'api-service': return 'border-blue-300 dark:border-blue-700';
    case 'database': return 'border-emerald-300 dark:border-emerald-700';
    case 'frontend': return 'border-purple-300 dark:border-purple-700';
    case 'auth-service': return 'border-amber-300 dark:border-amber-700';
    case 'message-queue': return 'border-orange-300 dark:border-orange-700';
    case 'storage': return 'border-cyan-300 dark:border-cyan-700';
    case 'serverless': return 'border-yellow-300 dark:border-yellow-700';
    default: return 'border-gray-300';
  }
}

function getBadgeVariant(serviceType: string): string {
  switch (serviceType) {
    case 'api-service': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'database': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'frontend': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'auth-service': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'message-queue': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'storage': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
    case 'serverless': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default: return '';
  }
}

interface BaseServiceNodeProps {
  data: ServiceNodeData;
  selected: boolean;
  children?: React.ReactNode;
}

export function BaseServiceNode({ data, selected, children }: BaseServiceNodeProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-white dark:bg-gray-900 shadow-md min-w-[220px] max-w-[280px]',
        getNodeColorClass(data.serviceType),
        selected && 'ring-2 ring-blue-500/50 border-blue-500'
      )}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" />

      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800">
        {getNodeIcon(data.serviceType)}
        <span className="font-medium text-sm truncate flex-1">{data.label}</span>
        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', getBadgeVariant(data.serviceType))}>
          {getTechLabel(data)}
        </Badge>
      </div>

      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
        {children}
      </div>

      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" />
    </div>
  );
}
