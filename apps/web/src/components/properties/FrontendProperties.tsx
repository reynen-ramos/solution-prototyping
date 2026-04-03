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
import { FRONTEND_FRAMEWORKS } from '@/types/tech-stacks';
import { useDesignStore } from '@/stores/designStore';
import type { ServiceNode, FrontendData } from '@/types/design';
import type { FrontendPage } from '@/types/service-types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  node: ServiceNode;
}

export function FrontendProperties({ node }: Props) {
  const data = node.data as FrontendData;
  const updateNodeData = useDesignStore((s) => s.updateNodeData);
  const updateNodeConfig = useDesignStore((s) => s.updateNodeConfig);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">App Name</Label>
        <Input
          className="h-8 text-xs"
          value={data.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
        />
      </div>

      <TechStackSelector
        label="Framework"
        value={data.config.framework}
        options={FRONTEND_FRAMEWORKS}
        onChange={(v) => updateNodeConfig(node.id, { framework: v })}
      />

      <div className="space-y-1.5">
        <Label className="text-xs">Port</Label>
        <Input
          className="h-8 text-xs"
          type="number"
          value={data.config.port}
          onChange={(e) => updateNodeConfig(node.id, { port: parseInt(e.target.value) || 5173 })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Styling</Label>
        <Select
          value={data.config.styling}
          onValueChange={(v) => updateNodeConfig(node.id, { styling: v })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tailwind" className="text-xs">Tailwind CSS</SelectItem>
            <SelectItem value="css-modules" className="text-xs">CSS Modules</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Pages */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Pages</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const newPage: FrontendPage = {
                name: 'New Page',
                route: '/new-page',
                description: '',
              };
              updateNodeConfig(node.id, {
                pages: [...data.config.pages, newPage],
              });
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {data.config.pages.map((page, i) => (
          <div key={i} className="border rounded p-2 space-y-1.5">
            <div className="flex items-center gap-1">
              <Input
                className="h-7 text-xs flex-1"
                value={page.name}
                placeholder="Page Name"
                onChange={(e) => {
                  const pages = [...data.config.pages];
                  pages[i] = { ...pages[i], name: e.target.value };
                  updateNodeConfig(node.id, { pages });
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  const pages = data.config.pages.filter((_, j) => j !== i);
                  updateNodeConfig(node.id, { pages });
                }}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
            <Input
              className="h-7 text-xs font-mono"
              value={page.route}
              placeholder="/route"
              onChange={(e) => {
                const pages = [...data.config.pages];
                pages[i] = { ...pages[i], route: e.target.value };
                updateNodeConfig(node.id, { pages });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
