'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Download, ArrowLeft } from 'lucide-react';
import type { GeneratedFile } from '@/types/generation';

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  content?: string;
  source?: 'template' | 'ai';
}

function buildFileTree(files: GeneratedFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        current.push({
          name,
          path: file.path,
          type: 'file',
          content: file.content,
          source: file.source,
        });
      } else {
        let folder = current.find(n => n.type === 'folder' && n.name === name);
        if (!folder) {
          folder = { name, path: parts.slice(0, i + 1).join('/'), type: 'folder', children: [] };
          current.push(folder);
        }
        current = folder.children!;
      }
    }
  }

  // Sort: folders first, then files, both alphabetical
  function sortNodes(nodes: FileTreeNode[]): FileTreeNode[] {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map(n => n.children ? { ...n, children: sortNodes(n.children) } : n);
  }

  return sortNodes(root);
}

function getLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts': case 'tsx': return 'typescript';
    case 'js': case 'jsx': return 'javascript';
    case 'py': return 'python';
    case 'cs': return 'csharp';
    case 'sql': return 'sql';
    case 'json': return 'json';
    case 'yml': case 'yaml': return 'yaml';
    case 'tf': return 'hcl';
    case 'md': return 'markdown';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'csproj': return 'xml';
    default: return 'text';
  }
}

interface FileTreeItemProps {
  node: FileTreeNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (node: FileTreeNode) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

function FileTreeItem({ node, depth, selectedPath, onSelect, expandedFolders, onToggleFolder }: FileTreeItemProps) {
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;

  if (node.type === 'folder') {
    return (
      <>
        <button
          onClick={() => onToggleFolder(node.path)}
          className={cn(
            'w-full flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-left',
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
          {isExpanded ? <FolderOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" /> : <Folder className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children?.map((child) => (
          <FileTreeItem
            key={child.path}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
            expandedFolders={expandedFolders}
            onToggleFolder={onToggleFolder}
          />
        ))}
      </>
    );
  }

  return (
    <button
      onClick={() => onSelect(node)}
      className={cn(
        'w-full flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-left',
        isSelected && 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      <File className="h-3.5 w-3.5 text-gray-400 shrink-0" />
      <span className="truncate">{node.name}</span>
      {node.source === 'ai' && (
        <Badge className="text-[8px] px-1 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 ml-auto">AI</Badge>
      )}
    </button>
  );
}

interface CodePreviewProps {
  files: GeneratedFile[];
  projectName: string;
  onBack: () => void;
  onDownload: () => void;
}

export function CodePreview({ files, projectName, onBack, onDownload }: CodePreviewProps) {
  const tree = buildFileTree(files);
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    // Expand top-level folders by default
    const initial = new Set<string>();
    tree.forEach(n => { if (n.type === 'folder') initial.add(n.path); });
    return initial;
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };

  const aiFileCount = files.filter(f => f.source === 'ai').length;

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b">
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
        </Button>
        <div className="flex-1 text-sm font-medium">{projectName}</div>
        <span className="text-xs text-gray-400">{files.length} files</span>
        {aiFileCount > 0 && (
          <Badge className="text-[10px] bg-purple-100 text-purple-700">{aiFileCount} AI-generated</Badge>
        )}
        <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-white text-xs" onClick={onDownload}>
          <Download className="h-3 w-3 mr-1" /> Download ZIP
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <ScrollArea className="w-56 border-r shrink-0">
          <div className="py-1">
            {tree.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                depth={0}
                selectedPath={selectedFile?.path ?? null}
                onSelect={setSelectedFile}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Code viewer */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-gray-50 dark:bg-gray-900">
                <File className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{selectedFile.path}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto">
                  {getLanguage(selectedFile.name)}
                </Badge>
              </div>
              <ScrollArea className="flex-1">
                <pre className="p-3 text-xs font-mono leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {selectedFile.content}
                </pre>
              </ScrollArea>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Select a file to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
