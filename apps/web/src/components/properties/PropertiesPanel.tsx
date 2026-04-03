'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useDesignStore } from '@/stores/designStore';
import { useUiStore } from '@/stores/uiStore';
import { ApiServiceProperties } from './ApiServiceProperties';
import { DatabaseProperties } from './DatabaseProperties';
import { FrontendProperties } from './FrontendProperties';
import type { ServiceNode } from '@/types/design';
import { X, Trash2 } from 'lucide-react';

function renderNodeProperties(node: ServiceNode) {
  switch (node.data.serviceType) {
    case 'api-service':
      return <ApiServiceProperties node={node} />;
    case 'database':
      return <DatabaseProperties node={node} />;
    case 'frontend':
      return <FrontendProperties node={node} />;
  }
}

export function PropertiesPanel() {
  const selectedNodeId = useUiStore((s) => s.selectedNodeId);
  const clearSelection = useUiStore((s) => s.clearSelection);
  const nodes = useDesignStore((s) => s.nodes);
  const removeNode = useDesignStore((s) => s.removeNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex flex-col items-center justify-center gap-2 px-6">
        <p className="text-sm font-medium text-gray-400">No component selected</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
          Click a component on the canvas to configure its tech stack, endpoints, models, and more.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-sm">Properties</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={clearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderNodeProperties(selectedNode)}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-3">
        <Button
          variant="destructive"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            removeNode(selectedNode.id);
            clearSelection();
          }}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Delete Component
        </Button>
      </div>
    </div>
  );
}
