'use client';

import type { NodeProps } from '@xyflow/react';
import type { MessageQueueData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function MessageQueueNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as MessageQueueData;
  const topicCount = nodeData.config.topics.length;
  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Engine: {nodeData.config.engine}</div>
        <div>Port: {nodeData.config.port}</div>
        <div>{topicCount} topic{topicCount !== 1 ? 's' : ''}</div>
      </div>
    </BaseServiceNode>
  );
}
