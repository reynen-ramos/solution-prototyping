'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TechStackSelector } from './TechStackSelector';
import { DATABASE_ENGINES } from '@/types/tech-stacks';
import { useDesignStore } from '@/stores/designStore';
import type { ServiceNode, DatabaseData } from '@/types/design';
import type { DatabaseTable, DatabaseColumn } from '@/types/service-types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  node: ServiceNode;
}

export function DatabaseProperties({ node }: Props) {
  const data = node.data as DatabaseData;
  const updateNodeData = useDesignStore((s) => s.updateNodeData);
  const updateNodeConfig = useDesignStore((s) => s.updateNodeConfig);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Display Name</Label>
        <Input
          className="h-8 text-xs"
          value={data.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
        />
      </div>

      <TechStackSelector
        label="Database Engine"
        value={data.config.engine}
        options={DATABASE_ENGINES}
        onChange={(v) => updateNodeConfig(node.id, { engine: v })}
      />

      <div className="space-y-1.5">
        <Label className="text-xs">Database Name</Label>
        <Input
          className="h-8 text-xs font-mono"
          value={data.config.databaseName}
          onChange={(e) => updateNodeConfig(node.id, { databaseName: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Port</Label>
        <Input
          className="h-8 text-xs"
          type="number"
          value={data.config.port}
          onChange={(e) => updateNodeConfig(node.id, { port: parseInt(e.target.value) || 5432 })}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`seed-${node.id}`}
          checked={data.config.seedData}
          onChange={(e) => updateNodeConfig(node.id, { seedData: e.target.checked })}
          className="h-3.5 w-3.5"
        />
        <Label htmlFor={`seed-${node.id}`} className="text-xs">Generate Seed Data</Label>
      </div>

      <Separator />

      {/* Tables */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Tables</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const newTable: DatabaseTable = {
                name: 'new_table',
                columns: [
                  { name: 'id', type: 'uuid', primaryKey: true, nullable: false, defaultValue: 'gen_random_uuid()' },
                  { name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, defaultValue: 'now()' },
                ],
              };
              updateNodeConfig(node.id, {
                tables: [...data.config.tables, newTable],
              });
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {data.config.tables.map((table, ti) => (
          <div key={ti} className="border rounded p-2 space-y-2">
            <div className="flex items-center gap-1">
              <Input
                className="h-7 text-xs flex-1 font-mono"
                value={table.name}
                onChange={(e) => {
                  const tables = [...data.config.tables];
                  tables[ti] = { ...tables[ti], name: e.target.value };
                  updateNodeConfig(node.id, { tables });
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  const tables = data.config.tables.filter((_, j) => j !== ti);
                  updateNodeConfig(node.id, { tables });
                }}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
            {table.columns.map((col, ci) => (
              <div key={ci} className="flex gap-1 items-center pl-2">
                <Input
                  className="h-6 text-[10px] flex-1 font-mono"
                  value={col.name}
                  placeholder="column"
                  onChange={(e) => {
                    const tables = [...data.config.tables];
                    const columns = [...tables[ti].columns];
                    columns[ci] = { ...columns[ci], name: e.target.value };
                    tables[ti] = { ...tables[ti], columns };
                    updateNodeConfig(node.id, { tables });
                  }}
                />
                <Select
                  value={col.type}
                  onValueChange={(v) => {
                    if (!v) return;
                    const tables = [...data.config.tables];
                    const columns = [...tables[ti].columns];
                    columns[ci] = { ...columns[ci], type: v };
                    tables[ti] = { ...tables[ti], columns };
                    updateNodeConfig(node.id, { tables });
                  }}
                >
                  <SelectTrigger className="h-6 text-[10px] w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['uuid', 'varchar', 'text', 'int', 'bigint', 'boolean', 'timestamp', 'json', 'decimal'].map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="checkbox"
                  checked={col.primaryKey}
                  title="Primary Key"
                  onChange={(e) => {
                    const tables = [...data.config.tables];
                    const columns = [...tables[ti].columns];
                    columns[ci] = { ...columns[ci], primaryKey: e.target.checked };
                    tables[ti] = { ...tables[ti], columns };
                    updateNodeConfig(node.id, { tables });
                  }}
                  className="h-3 w-3"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    const tables = [...data.config.tables];
                    const columns = tables[ti].columns.filter((_, j) => j !== ci);
                    tables[ti] = { ...tables[ti], columns };
                    updateNodeConfig(node.id, { tables });
                  }}
                >
                  <Trash2 className="h-2.5 w-2.5 text-red-400" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] w-full"
              onClick={() => {
                const tables = [...data.config.tables];
                const newCol: DatabaseColumn = {
                  name: '',
                  type: 'varchar',
                  primaryKey: false,
                  nullable: true,
                };
                tables[ti] = { ...tables[ti], columns: [...tables[ti].columns, newCol] };
                updateNodeConfig(node.id, { tables });
              }}
            >
              <Plus className="h-2.5 w-2.5 mr-1" /> Add Column
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
