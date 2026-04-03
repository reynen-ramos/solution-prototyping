'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { DesignerCanvas } from '@/components/canvas/DesignerCanvas';
import { ComponentPalette } from '@/components/palette/ComponentPalette';
import { PropertiesPanel } from '@/components/properties/PropertiesPanel';
import { DesignerToolbar } from '@/components/toolbar/DesignerToolbar';
import { GenerateDialog } from '@/components/generation/GenerateDialog';
import { useUiStore } from '@/stores/uiStore';
import { useDesignPersistence } from '@/hooks/useDesignPersistence';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function DesignerPage() {
  const palettePanelOpen = useUiStore((s) => s.palettePanelOpen);
  const propertiesPanelOpen = useUiStore((s) => s.propertiesPanelOpen);

  useDesignPersistence();
  useKeyboardShortcuts();

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col">
        <DesignerToolbar />
        <div className="flex-1 flex overflow-hidden">
          {palettePanelOpen && <ComponentPalette />}
          <DesignerCanvas />
          {propertiesPanelOpen && <PropertiesPanel />}
        </div>
      </div>
      <GenerateDialog />
    </ReactFlowProvider>
  );
}
