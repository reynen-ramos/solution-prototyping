'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PaletteItem } from './PaletteItem';
import { paletteItems } from './palette-items';

export function ComponentPalette() {
  return (
    <div className="w-60 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex flex-col">
      <div className="px-4 py-3 font-semibold text-sm">
        Components
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider px-1 mb-2">
            Core
          </div>
          {paletteItems.filter(i => i.category === 'core').map((item) => (
            <PaletteItem key={item.serviceType} {...item} />
          ))}
          <div className="text-xs text-gray-400 uppercase tracking-wider px-1 mb-2 mt-4">
            Infrastructure
          </div>
          {paletteItems.filter(i => i.category === 'infrastructure').map((item) => (
            <PaletteItem key={item.serviceType} {...item} />
          ))}
          <div className="text-xs text-gray-400 uppercase tracking-wider px-1 mb-2 mt-4">
            Compute
          </div>
          {paletteItems.filter(i => i.category === 'compute').map((item) => (
            <PaletteItem key={item.serviceType} {...item} />
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-3 text-xs text-gray-400 text-center">
        Drag onto canvas
      </div>
    </div>
  );
}
