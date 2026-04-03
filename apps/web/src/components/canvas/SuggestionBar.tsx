'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useDesignStore } from '@/stores/designStore';
import type { ConnectionSuggestion } from '@/lib/connection-suggestions';
import { getSuggestionsForConnection } from '@/lib/connection-suggestions';
import { Sparkles, X, Check } from 'lucide-react';

export function SuggestionBar() {
  const nodes = useDesignStore((s) => s.nodes);
  const edges = useDesignStore((s) => s.edges);
  const updateNodeConfig = useDesignStore((s) => s.updateNodeConfig);
  const updateEdgeData = useDesignStore((s) => s.updateEdgeData);

  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [lastEdgeCount, setLastEdgeCount] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Detect new edges and generate suggestions
  useEffect(() => {
    if (edges.length > lastEdgeCount && edges.length > 0) {
      const newEdge = edges[edges.length - 1];
      const sourceNode = nodes.find(n => n.id === newEdge.source);
      const targetNode = nodes.find(n => n.id === newEdge.target);

      if (sourceNode && targetNode) {
        const newSuggestions = getSuggestionsForConnection(sourceNode, targetNode);
        const filtered = newSuggestions.filter(s => !dismissed.has(s.id));
        if (filtered.length > 0) {
          setSuggestions(prev => [...prev, ...filtered]);
        }
      }
    }
    setLastEdgeCount(edges.length);
  }, [edges.length, nodes, lastEdgeCount, dismissed]);

  const handleApply = useCallback((suggestion: ConnectionSuggestion) => {
    // Find the edge for this connection
    const edge = edges.find(
      e => e.source === suggestion.sourceNodeId && e.target === suggestion.targetNodeId
    );
    if (edge) {
      suggestion.apply(updateNodeConfig, updateEdgeData, edge.id);
    }
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    setDismissed(prev => new Set(prev).add(suggestion.id));
  }, [edges, updateNodeConfig, updateEdgeData]);

  const handleDismiss = useCallback((id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
    setDismissed(prev => new Set(prev).add(id));
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md">
      {suggestions.slice(0, 3).map((suggestion) => (
        <div
          key={suggestion.id}
          className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800
                     rounded-lg shadow-lg animate-in slide-in-from-bottom-2"
        >
          <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{suggestion.title}</div>
            <div className="text-xs text-gray-500 truncate">{suggestion.description}</div>
          </div>
          <Button
            size="sm"
            className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleApply(suggestion)}
          >
            <Check className="h-3 w-3 mr-1" /> Apply
          </Button>
          <button
            onClick={() => handleDismiss(suggestion.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
