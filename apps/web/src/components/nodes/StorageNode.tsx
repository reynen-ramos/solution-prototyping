'use client';

import type { NodeProps } from '@xyflow/react';
import type { StorageData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function StorageNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as StorageData;
  const bucketCount = nodeData.config.buckets.length;
  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Provider: {nodeData.config.provider}</div>
        <div>{bucketCount} bucket{bucketCount !== 1 ? 's' : ''}</div>
        <div>Max: {nodeData.config.maxFileSizeMb}MB</div>
      </div>
    </BaseServiceNode>
  );
}
