'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUiStore } from '@/stores/uiStore';
import { useDesignStore } from '@/stores/designStore';
import { useState } from 'react';
import { Download, Zap, Cloud, Eye, Loader2 } from 'lucide-react';
import type { CloudProvider, GeneratedFile } from '@/types/generation';
import { CodePreview } from './CodePreview';
import JSZip from 'jszip';

type Step = 'configure' | 'preview';

export function GenerateDialog() {
  const showGenerateDialog = useUiStore((s) => s.showGenerateDialog);
  const closeGenerateDialog = useUiStore((s) => s.closeGenerateDialog);
  const nodes = useDesignStore((s) => s.nodes);
  const getDesignDocument = useDesignStore((s) => s.getDesignDocument);

  const [step, setStep] = useState<Step>('configure');
  const [includeDocker, setIncludeDocker] = useState(true);
  const [useAi, setUseAi] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [projectSlug, setProjectSlug] = useState('');

  const canGenerate = nodes.length > 0;
  const canUseAi = useAi && apiKey.length > 0;

  const handleClose = () => {
    closeGenerateDialog();
    // Reset state after close animation
    setTimeout(() => {
      setStep('configure');
      setGeneratedFiles([]);
    }, 200);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const design = getDesignDocument();
      const slug = design.name.toLowerCase().replace(/\s+/g, '-');
      setProjectSlug(slug);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design,
          options: {
            includeDocker,
            includeReadme: true,
            includeSeedData: true,
            claudeApiKey: useAi ? apiKey : undefined,
            useAiGeneration: useAi && apiKey.length > 0,
            cloudProvider,
            returnJson: true,
          },
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        // New JSON response with file list
        const data = await response.json();
        setGeneratedFiles(data.files);
        setStep('preview');
      } else {
        // Fallback: ZIP response (direct download)
        const blob = await response.blob();
        downloadBlob(blob, `${slug}.zip`);
        handleClose();
      }
    } catch (err) {
      alert('Generation failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const folder = zip.folder(projectSlug)!;
    for (const file of generatedFiles) {
      folder.file(file.path, file.content);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${projectSlug}.zip`);
    handleClose();
  };

  return (
    <Dialog open={showGenerateDialog} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={step === 'preview' ? 'sm:max-w-4xl p-0' : 'sm:max-w-md'}>
        {step === 'configure' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Generate Application
              </DialogTitle>
              <DialogDescription>
                Generate a working application from your design. {nodes.length} component{nodes.length !== 1 ? 's' : ''} in design.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-docker"
                  checked={includeDocker}
                  onChange={(e) => setIncludeDocker(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="include-docker">Include Docker & docker-compose</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use-ai"
                  checked={useAi}
                  onChange={(e) => setUseAi(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="use-ai">Use AI for business logic (Claude API)</Label>
              </div>

              {useAi && (
                <div className="space-y-1.5 pl-6">
                  <Label className="text-xs">Claude API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-ant-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                  <p className="text-[10px] text-gray-400">
                    Your key is never stored. Used only for this generation.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Cloud className="h-4 w-4" /> Deploy Target (Infrastructure as Code)
                </Label>
                <div className="flex gap-2">
                  {([['none', 'None'], ['aws', 'AWS']] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setCloudProvider(value)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        cloudProvider === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    disabled
                    className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-400 dark:border-gray-700 cursor-not-allowed"
                    title="Coming soon"
                  >
                    Azure
                  </button>
                  <button
                    disabled
                    className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-400 dark:border-gray-700 cursor-not-allowed"
                    title="Coming soon"
                  >
                    GCP
                  </button>
                </div>
                {cloudProvider === 'aws' && (
                  <p className="text-[10px] text-gray-400">
                    Generates Terraform files for VPC, ECS Fargate, RDS, and S3.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating || (useAi && !canUseAi)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...</>
                ) : (
                  <><Eye className="h-4 w-4 mr-1" /> Generate & Preview</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'preview' && (
          <CodePreview
            files={generatedFiles}
            projectName={projectSlug}
            onBack={() => setStep('configure')}
            onDownload={handleDownload}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
