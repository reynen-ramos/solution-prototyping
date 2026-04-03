'use client';

import { useEffect } from 'react';
import { useDesignStore } from '@/stores/designStore';
import { useUiStore } from '@/stores/uiStore';

export function useKeyboardShortcuts() {
  const removeNode = useDesignStore((s) => s.removeNode);
  const removeEdge = useDesignStore((s) => s.removeEdge);
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const autoLayout = useDesignStore((s) => s.autoLayout);
  const selectedNodeId = useUiStore((s) => s.selectedNodeId);
  const selectedEdgeId = useUiStore((s) => s.selectedEdgeId);
  const clearSelection = useUiStore((s) => s.clearSelection);
  const openGenerateDialog = useUiStore((s) => s.openGenerateDialog);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Ctrl shortcuts work even in inputs
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
          return;
        }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
          return;
        }
        if (e.key === 'g') {
          e.preventDefault();
          openGenerateDialog();
          return;
        }
        if (e.key === 'l') {
          e.preventDefault();
          autoLayout('LR');
          return;
        }
      }

      if (isInput) return;

      // Delete selected node/edge
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          removeNode(selectedNodeId);
          clearSelection();
        } else if (selectedEdgeId) {
          removeEdge(selectedEdgeId);
          clearSelection();
        }
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        clearSelection();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, removeNode, removeEdge, undo, redo, autoLayout, clearSelection, openGenerateDialog]);
}
