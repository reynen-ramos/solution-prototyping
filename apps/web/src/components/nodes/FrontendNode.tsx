'use client';

import type { NodeProps } from '@xyflow/react';
import type { FrontendData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function FrontendNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FrontendData;
  const pageCount = nodeData.config.pages.length;

  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Port: {nodeData.config.port}</div>
        <div>{pageCount} page{pageCount !== 1 ? 's' : ''}</div>
        <div>Styling: {nodeData.config.styling}</div>
      </div>
    </BaseServiceNode>
  );
}
