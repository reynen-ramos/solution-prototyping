'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { TechStackOption } from '@/types/tech-stacks';

interface TechStackSelectorProps {
  label: string;
  value: string;
  options: Record<string, TechStackOption>;
  onChange: (value: string) => void;
}

export function TechStackSelector({ label, value, options, onChange }: TechStackSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={(v) => { if (v) onChange(v); }}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(options).map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="text-xs">
              <div>
                <span className="font-medium">{opt.label}</span>
                <span className="text-gray-400 ml-2">{opt.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
