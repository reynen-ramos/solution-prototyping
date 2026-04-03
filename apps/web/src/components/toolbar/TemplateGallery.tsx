'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useDesignStore } from '@/stores/designStore';
import { starterTemplates, type StarterTemplate } from '@/lib/starter-templates';
import { Rocket, Boxes, ShoppingCart, Building } from 'lucide-react';

const iconMap: Record<string, typeof Rocket> = {
  rocket: Rocket,
  boxes: Boxes,
  'shopping-cart': ShoppingCart,
  building: Building,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TemplateGallery({ open, onClose }: Props) {
  const loadDesignDocument = useDesignStore((s) => s.loadDesignDocument);

  const handleSelect = (template: StarterTemplate) => {
    // Create a fresh copy with new timestamps
    const design = {
      ...template.design,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    loadDesignDocument(design);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Architecture Templates</DialogTitle>
          <DialogDescription>
            Start with a pre-built architecture and customize it to your needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          {starterTemplates.map((tpl) => {
            const Icon = iconMap[tpl.icon] || Rocket;
            const nodeCount = tpl.design.nodes.length;
            const edgeCount = tpl.design.edges.length;

            return (
              <button
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700
                           hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30
                           transition-all text-left group"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                  <span className="font-semibold text-sm">{tpl.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {tpl.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400">
                    {nodeCount} services &middot; {edgeCount} connections
                  </span>
                  <div className="flex-1" />
                  {tpl.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
