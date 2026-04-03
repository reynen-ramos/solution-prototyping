'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useDesignStore } from '@/stores/designStore';
import { useUiStore } from '@/stores/uiStore';
import { TemplateGallery } from './TemplateGallery';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  Save,
  FolderOpen,
  FilePlus,
  Zap,
  PanelLeft,
  PanelRight,
  Undo2,
  Redo2,
  LayoutDashboard,
  LayoutTemplate,
  Moon,
  Sun,
} from 'lucide-react';

export function DesignerToolbar() {
  const [showTemplates, setShowTemplates] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const projectName = useDesignStore((s) => s.projectName);
  const setProjectName = useDesignStore((s) => s.setProjectName);
  const getDesignDocument = useDesignStore((s) => s.getDesignDocument);
  const loadDesignDocument = useDesignStore((s) => s.loadDesignDocument);
  const clearDesign = useDesignStore((s) => s.clearDesign);
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const canUndo = useDesignStore((s) => s.canUndo);
  const canRedo = useDesignStore((s) => s.canRedo);
  const autoLayout = useDesignStore((s) => s.autoLayout);

  const togglePalettePanel = useUiStore((s) => s.togglePalettePanel);
  const togglePropertiesPanel = useUiStore((s) => s.togglePropertiesPanel);
  const openGenerateDialog = useUiStore((s) => s.openGenerateDialog);

  const handleSave = () => {
    const doc = getDesignDocument();
    const json = JSON.stringify(doc, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const doc = JSON.parse(ev.target?.result as string);
          loadDesignDocument(doc);
        } catch {
          alert('Invalid design file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex items-center px-3 gap-2">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={togglePalettePanel} title="Toggle Palette">
        <PanelLeft className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Input
        className="h-8 w-56 text-sm font-medium border-transparent hover:border-gray-300 focus:border-gray-300"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => clearDesign()} title="New Design">
        <FilePlus className="h-3.5 w-3.5" /> New
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowTemplates(true)} title="Architecture Templates">
        <LayoutTemplate className="h-3.5 w-3.5" /> Templates
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={handleSave} title="Save Design">
        <Save className="h-3.5 w-3.5" /> Save
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={handleLoad} title="Load Design">
        <FolderOpen className="h-3.5 w-3.5" /> Load
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)">
        <Undo2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Y)">
        <Redo2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => autoLayout('LR')} title="Auto Layout">
        <LayoutDashboard className="h-3.5 w-3.5" /> Layout
      </Button>

      <div className="flex-1" />

      <Button
        size="sm"
        className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={openGenerateDialog}
      >
        <Zap className="h-3.5 w-3.5" /> Generate App
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleDarkMode} title={isDark ? 'Light Mode' : 'Dark Mode'}>
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={togglePropertiesPanel} title="Toggle Properties">
        <PanelRight className="h-4 w-4" />
      </Button>
      <TemplateGallery open={showTemplates} onClose={() => setShowTemplates(false)} />
    </div>
  );
}
