'use client';

import type { NodeProps } from '@xyflow/react';
import type { ApiServiceData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function ApiServiceNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ApiServiceData;
  const endpointCount = nodeData.config.endpoints.length;
  const modelCount = nodeData.config.models.length;

  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Port: {nodeData.config.port}</div>
        <div>{endpointCount} endpoint{endpointCount !== 1 ? 's' : ''}</div>
        <div>{modelCount} model{modelCount !== 1 ? 's' : ''}</div>
        {nodeData.config.authentication && (
          <div className="text-amber-600">Auth enabled</div>
        )}
      </div>
    </BaseServiceNode>
  );
}
