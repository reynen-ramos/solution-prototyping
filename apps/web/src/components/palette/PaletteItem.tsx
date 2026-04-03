'use client';

import type { DragEvent } from 'react';
import { Server, Database, Monitor, Shield, MessagesSquare, HardDrive, Zap } from 'lucide-react';
import { setDragData } from '@/hooks/useDragFromPalette';
import type { PaletteItemDef } from './palette-items';

const iconMap: Record<string, typeof Server> = {
  server: Server,
  database: Database,
  monitor: Monitor,
  shield: Shield,
  'messages-square': MessagesSquare,
  'hard-drive': HardDrive,
  zap: Zap,
};

export function PaletteItem({ serviceType, label, description, iconName }: PaletteItemDef) {
  const Icon = iconMap[iconName] || Server;

  const onDragStart = (e: DragEvent) => {
    setDragData(e, serviceType);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700
                 cursor-grab hover:bg-gray-50 dark:hover:bg-gray-800 active:cursor-grabbing
                 transition-colors select-none"
    >
      <Icon className="h-5 w-5 text-gray-500 shrink-0" />
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{description}</div>
      </div>
    </div>
  );
}
