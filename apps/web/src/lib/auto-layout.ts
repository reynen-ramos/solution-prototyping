import Dagre from '@dagrejs/dagre';
import type { ServiceNode, ServiceEdge } from '@/types/design';

interface LayoutOptions {
  direction: 'LR' | 'TB';
  nodeWidth?: number;
  nodeHeight?: number;
  spacing?: number;
}

export function getLayoutedElements(
  nodes: ServiceNode[],
  edges: ServiceEdge[],
  options: LayoutOptions = { direction: 'LR' },
): { nodes: ServiceNode[]; edges: ServiceEdge[] } {
  const { direction, nodeWidth = 250, nodeHeight = 120, spacing = 80 } = options;

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: spacing,
    ranksep: spacing * 1.5,
    edgesep: spacing / 2,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes as ServiceNode[], edges };
}
