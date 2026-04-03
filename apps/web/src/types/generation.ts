import type { DesignDocument } from './design';

export type CloudProvider = 'none' | 'aws' | 'azure' | 'gcp';

export interface GenerationOptions {
  includeDocker: boolean;
  includeReadme: boolean;
  includeSeedData: boolean;
  claudeApiKey?: string;
  useAiGeneration: boolean;
  cloudProvider: CloudProvider;
}

export interface GenerationRequest {
  design: DesignDocument;
  options: GenerationOptions;
}

export interface GeneratedFile {
  path: string;
  content: string;
  source: 'template' | 'ai';
}

export interface GenerationResult {
  files: GeneratedFile[];
  projectName: string;
  generatedAt: string;
}

export interface GenerationProgress {
  phase: 'validating' | 'scaffolding' | 'generating' | 'assembling' | 'complete' | 'error';
  message: string;
  percent: number;
  currentFile?: string;
}
