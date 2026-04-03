'use client';

import type { NodeProps } from '@xyflow/react';
import type { DatabaseData } from '@/types/design';
import { BaseServiceNode } from './BaseServiceNode';

export function DatabaseNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as DatabaseData;
  const tableCount = nodeData.config.tables.length;

  return (
    <BaseServiceNode data={nodeData} selected={selected}>
      <div className="space-y-1">
        <div>Port: {nodeData.config.port}</div>
        <div>DB: {nodeData.config.databaseName}</div>
        <div>{tableCount} table{tableCount !== 1 ? 's' : ''}</div>
        {nodeData.config.seedData && (
          <div className="text-green-600">Seed data enabled</div>
        )}
      </div>
    </BaseServiceNode>
  );
}
