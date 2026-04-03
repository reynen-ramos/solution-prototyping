'use client';

import type { NodeProps } from '@xyflow/react';
import type { AuthServiceNodeData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function AuthServiceNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as AuthServiceNodeData;
  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Provider: {nodeData.config.provider.toUpperCase()}</div>
        <div>Port: {nodeData.config.port}</div>
        {nodeData.config.enableRegistration && <div>Registration enabled</div>}
      </div>
    </BaseServiceNode>
  );
}
