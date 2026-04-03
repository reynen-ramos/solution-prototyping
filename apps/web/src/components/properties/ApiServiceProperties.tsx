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
import { API_TECH_STACKS } from '@/types/tech-stacks';
import { useDesignStore } from '@/stores/designStore';
import type { ServiceNode, ApiServiceData } from '@/types/design';
import type { ApiEndpoint, ApiModel, ApiModelField } from '@/types/service-types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  node: ServiceNode;
}

export function ApiServiceProperties({ node }: Props) {
  const data = node.data as ApiServiceData;
  const updateNodeData = useDesignStore((s) => s.updateNodeData);
  const updateNodeConfig = useDesignStore((s) => s.updateNodeConfig);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Service Name</Label>
        <Input
          className="h-8 text-xs"
          value={data.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
        />
      </div>

      <TechStackSelector
        label="Tech Stack"
        value={data.config.techStack}
        options={API_TECH_STACKS}
        onChange={(v) => updateNodeConfig(node.id, { techStack: v })}
      />

      <div className="space-y-1.5">
        <Label className="text-xs">Port</Label>
        <Input
          className="h-8 text-xs"
          type="number"
          value={data.config.port}
          onChange={(e) => updateNodeConfig(node.id, { port: parseInt(e.target.value) || 3001 })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Base Path</Label>
        <Input
          className="h-8 text-xs"
          value={data.config.basePath}
          onChange={(e) => updateNodeConfig(node.id, { basePath: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`auth-${node.id}`}
          checked={data.config.authentication}
          onChange={(e) => updateNodeConfig(node.id, { authentication: e.target.checked })}
          className="h-3.5 w-3.5"
        />
        <Label htmlFor={`auth-${node.id}`} className="text-xs">Enable Authentication</Label>
      </div>

      <Separator />

      {/* Endpoints */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Endpoints</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const newEndpoint: ApiEndpoint = {
                method: 'GET',
                path: '/items',
                description: '',
              };
              updateNodeConfig(node.id, {
                endpoints: [...data.config.endpoints, newEndpoint],
              });
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {data.config.endpoints.map((ep, i) => (
          <div key={i} className="flex gap-1 items-center">
            <Select
              value={ep.method}
              onValueChange={(v) => {
                const endpoints = [...data.config.endpoints];
                endpoints[i] = { ...endpoints[i], method: v as ApiEndpoint['method'] };
                updateNodeConfig(node.id, { endpoints });
              }}
            >
              <SelectTrigger className="h-7 text-[10px] w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                  <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-7 text-xs flex-1"
              value={ep.path}
              placeholder="/path"
              onChange={(e) => {
                const endpoints = [...data.config.endpoints];
                endpoints[i] = { ...endpoints[i], path: e.target.value };
                updateNodeConfig(node.id, { endpoints });
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => {
                const endpoints = data.config.endpoints.filter((_, j) => j !== i);
                updateNodeConfig(node.id, { endpoints });
              }}
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Models */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Models</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const newModel: ApiModel = {
                name: 'NewModel',
                fields: [{ name: 'id', type: 'string', required: true, description: 'Primary key' }],
              };
              updateNodeConfig(node.id, {
                models: [...data.config.models, newModel],
              });
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {data.config.models.map((model, i) => (
          <div key={i} className="border rounded p-2 space-y-2">
            <div className="flex items-center gap-1">
              <Input
                className="h-7 text-xs flex-1 font-mono"
                value={model.name}
                onChange={(e) => {
                  const models = [...data.config.models];
                  models[i] = { ...models[i], name: e.target.value };
                  updateNodeConfig(node.id, { models });
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  const models = data.config.models.filter((_, j) => j !== i);
                  updateNodeConfig(node.id, { models });
                }}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
            {model.fields.map((field, fi) => (
              <div key={fi} className="flex gap-1 items-center pl-2">
                <Input
                  className="h-6 text-[10px] flex-1 font-mono"
                  value={field.name}
                  placeholder="name"
                  onChange={(e) => {
                    const models = [...data.config.models];
                    const fields = [...models[i].fields];
                    fields[fi] = { ...fields[fi], name: e.target.value };
                    models[i] = { ...models[i], fields };
                    updateNodeConfig(node.id, { models });
                  }}
                />
                <Select
                  value={field.type}
                  onValueChange={(v) => {
                    if (!v) return;
                    const models = [...data.config.models];
                    const fields = [...models[i].fields];
                    fields[fi] = { ...fields[fi], type: v };
                    models[i] = { ...models[i], fields };
                    updateNodeConfig(node.id, { models });
                  }}
                >
                  <SelectTrigger className="h-6 text-[10px] w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['string', 'number', 'boolean', 'Date'].map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    const models = [...data.config.models];
                    const fields = models[i].fields.filter((_, j) => j !== fi);
                    models[i] = { ...models[i], fields };
                    updateNodeConfig(node.id, { models });
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
                const models = [...data.config.models];
                const newField: ApiModelField = { name: '', type: 'string', required: false, description: '' };
                models[i] = { ...models[i], fields: [...models[i].fields, newField] };
                updateNodeConfig(node.id, { models });
              }}
            >
              <Plus className="h-2.5 w-2.5 mr-1" /> Add Field
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
