'use client';

import { useCallback, type DragEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useDesignStore } from '@/stores/designStore';
import type { ServiceType } from '@/types/service-types';

const DRAG_DATA_KEY = 'application/soluproto-service-type';

export function setDragData(e: DragEvent, serviceType: ServiceType) {
  e.dataTransfer.setData(DRAG_DATA_KEY, serviceType);
  e.dataTransfer.effectAllowed = 'move';
}

export function useDragFromPalette() {
  const { screenToFlowPosition } = useReactFlow();
  const addServiceNode = useDesignStore((s) => s.addServiceNode);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const serviceType = e.dataTransfer.getData(DRAG_DATA_KEY) as ServiceType;
      if (!serviceType) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      addServiceNode(serviceType, position);
    },
    [screenToFlowPosition, addServiceNode]
  );

  return { onDragOver, onDrop };
}
