'use client';

import type { NodeProps } from '@xyflow/react';
import type { ServerlessData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function ServerlessNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ServerlessData;
  const fnCount = nodeData.config.functions.length;
  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Runtime: {nodeData.config.runtime}</div>
        <div>{fnCount} function{fnCount !== 1 ? 's' : ''}</div>
      </div>
    </BaseServiceNode>
  );
}
