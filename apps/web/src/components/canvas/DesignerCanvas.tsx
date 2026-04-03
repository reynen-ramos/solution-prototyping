'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDesignStore } from '@/stores/designStore';
import { useUiStore } from '@/stores/uiStore';
import { nodeTypes } from '@/components/nodes/node-types';
import { edgeTypes } from '@/components/edges/edge-types';
import { useDragFromPalette } from '@/hooks/useDragFromPalette';
import { SuggestionBar } from './SuggestionBar';
import { LayoutTemplate, MousePointerClick } from 'lucide-react';

export function DesignerCanvas() {
  const nodes = useDesignStore((s) => s.nodes);
  const edges = useDesignStore((s) => s.edges);
  const onNodesChange = useDesignStore((s) => s.onNodesChange);
  const onEdgesChange = useDesignStore((s) => s.onEdgesChange);
  const onConnect = useDesignStore((s) => s.onConnect);
  const viewport = useDesignStore((s) => s.viewport);
  const setViewport = useDesignStore((s) => s.setViewport);

  const selectNode = useUiStore((s) => s.selectNode);
  const selectEdge = useUiStore((s) => s.selectEdge);
  const clearSelection = useUiStore((s) => s.clearSelection);

  const { onDragOver, onDrop } = useDragFromPalette();
  const { fitView } = useReactFlow();
  const prevNodeCount = useRef(nodes.length);

  // Auto-fit when nodes go from 0 → N (template loaded or first drop)
  useEffect(() => {
    if (prevNodeCount.current === 0 && nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
    }
    prevNodeCount.current = nodes.length;
  }, [nodes.length, fitView]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onViewportChange={setViewport}
        defaultViewport={viewport}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'connection',
          animated: true,
        }}
        connectionLineStyle={{ strokeWidth: 2, stroke: '#94a3b8' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          className="!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-700"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center space-y-3 pointer-events-auto">
            <div className="flex justify-center gap-3 text-gray-300 dark:text-gray-600">
              <LayoutTemplate className="h-10 w-10" />
              <MousePointerClick className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 dark:text-gray-500">
              Start designing your architecture
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-600 max-w-xs">
              Drag components from the left panel, or click <strong>Templates</strong> in the toolbar to start from a pre-built architecture.
            </p>
          </div>
        </div>
      )}
      <SuggestionBar />
    </div>
  );
}
