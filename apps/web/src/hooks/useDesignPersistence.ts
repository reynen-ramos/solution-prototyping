'use client';

import { useEffect, useRef } from 'react';
import { useDesignStore } from '@/stores/designStore';

const STORAGE_KEY = 'sp:design';
const DEBOUNCE_MS = 1000;

export function useDesignPersistence() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nodes = useDesignStore((s) => s.nodes);
  const edges = useDesignStore((s) => s.edges);
  const viewport = useDesignStore((s) => s.viewport);
  const projectName = useDesignStore((s) => s.projectName);
  const loadDesignDocument = useDesignStore((s) => s.loadDesignDocument);

  // Load on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const doc = JSON.parse(saved);
        loadDesignDocument(doc);
      }
    } catch {
      // Ignore invalid saved data
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save on change (debounced)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const doc = {
          id: 'local',
          name: projectName,
          version: '1' as const,
          nodes,
          edges,
          viewport,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      } catch {
        // localStorage full or unavailable
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, viewport, projectName]);
}
