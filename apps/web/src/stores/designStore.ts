import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Viewport,
} from '@xyflow/react';
import type {
  ServiceNode,
  ServiceEdge,
  ConnectionData,
  ServiceNodeData,
  DesignDocument,
} from '@/types/design';
import type { ServiceType } from '@/types/service-types';
import { getDefaultConfig } from '@/types/tech-stacks';
import { nanoid } from 'nanoid';
import { canConnect } from '@/lib/connection-rules';
import { getLayoutedElements } from '@/lib/auto-layout';

interface HistoryEntry {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
}

const MAX_HISTORY = 50;

interface DesignState {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
  viewport: Viewport;
  projectName: string;

  // Undo/redo
  history: HistoryEntry[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // React Flow event handlers
  onNodesChange: OnNodesChange<ServiceNode>;
  onEdgesChange: OnEdgesChange<ServiceEdge>;
  onConnect: OnConnect;
  setViewport: (viewport: Viewport) => void;

  // Design actions
  setProjectName: (name: string) => void;
  addServiceNode: (serviceType: ServiceType, position: { x: number; y: number }) => string;
  updateNodeData: (nodeId: string, data: Partial<ServiceNodeData>) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  updateEdgeData: (edgeId: string, data: Partial<ConnectionData>) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  autoLayout: (direction?: 'LR' | 'TB') => void;

  // Serialization
  getDesignDocument: () => DesignDocument;
  loadDesignDocument: (doc: DesignDocument) => void;
  clearDesign: () => void;
}

function getDefaultLabel(serviceType: ServiceType): string {
  switch (serviceType) {
    case 'api-service': return 'API Service';
    case 'database': return 'Database';
    case 'frontend': return 'Frontend';
    case 'auth-service': return 'Auth Service';
    case 'message-queue': return 'Message Queue';
    case 'storage': return 'Storage';
    case 'serverless': return 'Serverless';
  }
}

function pushHistory(state: { history: HistoryEntry[]; historyIndex: number; nodes: ServiceNode[]; edges: ServiceEdge[] }) {
  const entry: HistoryEntry = {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
  };
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(entry);
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

export const useDesignStore = create<DesignState>((set, get) => ({
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  projectName: 'Untitled Project',
  history: [],
  historyIndex: -1,

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as ServiceNode[] });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as ServiceEdge[] });
  },

  onConnect: (connection) => {
    // Validate connection
    const { nodes } = get();
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    if (sourceNode && targetNode) {
      const sourceType = sourceNode.data.serviceType;
      const targetType = targetNode.data.serviceType;
      if (!canConnect(sourceType, targetType)) return;
    }

    const state = get();
    const hist = pushHistory(state);

    const newEdge: ServiceEdge = {
      ...connection,
      id: `e-${nanoid(8)}`,
      type: 'connection',
      data: {
        label: '',
        connectionType: 'custom',
        description: '',
      },
    };
    set({ edges: addEdge(newEdge, state.edges) as ServiceEdge[], ...hist });
  },

  setViewport: (viewport) => set({ viewport }),
  setProjectName: (name) => set({ projectName: name }),

  addServiceNode: (serviceType, position) => {
    const state = get();
    const hist = pushHistory(state);
    const id = `${serviceType}-${nanoid(8)}`;
    const config = getDefaultConfig(serviceType);
    const node = {
      id,
      type: serviceType,
      position,
      data: {
        label: getDefaultLabel(serviceType),
        description: '',
        serviceType,
        config,
      },
    } as ServiceNode;
    set({ nodes: [...state.nodes, node], ...hist });
    return id;
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } as ServiceNode : n
      ),
    });
  },

  updateNodeConfig: (nodeId, config) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, config: { ...n.data.config, ...config } } } as ServiceNode
          : n
      ),
    });
  },

  updateEdgeData: (edgeId, data) => {
    set({
      edges: get().edges.map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data, ...data } } as ServiceEdge : e
      ),
    });
  },

  removeNode: (nodeId) => {
    const state = get();
    const hist = pushHistory(state);
    set({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      ...hist,
    });
  },

  removeEdge: (edgeId) => {
    const state = get();
    const hist = pushHistory(state);
    set({ edges: state.edges.filter((e) => e.id !== edgeId), ...hist });
  },

  autoLayout: (direction = 'LR') => {
    const state = get();
    const hist = pushHistory(state);
    const { nodes, edges } = getLayoutedElements(state.nodes, state.edges, { direction });
    set({ nodes, edges, ...hist });
  },

  getDesignDocument: () => {
    const { nodes, edges, viewport, projectName } = get();
    return {
      id: nanoid(),
      name: projectName,
      version: '1' as const,
      nodes,
      edges,
      viewport,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  loadDesignDocument: (doc) => {
    set({
      nodes: doc.nodes,
      edges: doc.edges,
      viewport: doc.viewport,
      projectName: doc.name,
    });
  },

  clearDesign: () => {
    set({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      projectName: 'Untitled Project',
    });
  },
}));
