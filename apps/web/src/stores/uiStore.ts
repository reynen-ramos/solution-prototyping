import { create } from 'zustand';

interface UiState {
  palettePanelOpen: boolean;
  propertiesPanelOpen: boolean;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  showGenerateDialog: boolean;
  showSaveDialog: boolean;
  showLoadDialog: boolean;

  togglePalettePanel: () => void;
  togglePropertiesPanel: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;
  openGenerateDialog: () => void;
  closeGenerateDialog: () => void;
  openSaveDialog: () => void;
  closeSaveDialog: () => void;
  openLoadDialog: () => void;
  closeLoadDialog: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  palettePanelOpen: true,
  propertiesPanelOpen: true,
  selectedNodeId: null,
  selectedEdgeId: null,
  showGenerateDialog: false,
  showSaveDialog: false,
  showLoadDialog: false,

  togglePalettePanel: () => set((s) => ({ palettePanelOpen: !s.palettePanelOpen })),
  togglePropertiesPanel: () => set((s) => ({ propertiesPanelOpen: !s.propertiesPanelOpen })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),

  openGenerateDialog: () => set({ showGenerateDialog: true }),
  closeGenerateDialog: () => set({ showGenerateDialog: false }),
  openSaveDialog: () => set({ showSaveDialog: true }),
  closeSaveDialog: () => set({ showSaveDialog: false }),
  openLoadDialog: () => set({ showLoadDialog: true }),
  closeLoadDialog: () => set({ showLoadDialog: false }),
}));
