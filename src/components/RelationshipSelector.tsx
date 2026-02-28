import React from 'react';
import { Relationship } from '../types';

interface RelationshipSelectorProps {
  selected: Relationship[];
  onChange: (selected: Relationship[]) => void;
}

const RELATIONSHIPS: Relationship[] = [
  '上司', '仲の良い上司', '友達', '親友', '初対面', '知り合い', '知り合い以上友達未満'
];

export function RelationshipSelector({ selected, onChange }: RelationshipSelectorProps) {
  const toggle = (rel: Relationship) => {
    if (selected.includes(rel)) {
      onChange(selected.filter(r => r !== rel));
    } else {
      onChange([...selected, rel]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
        Target Relationship
      </label>
      <div className="flex flex-wrap gap-2">
        {RELATIONSHIPS.map((rel) => {
          const isSelected = selected.includes(rel);
          return (
            <button
              key={rel}
              type="button"
              onClick={() => toggle(rel)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                isSelected 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'glass-panel text-white/70 hover:text-white border border-white/10 hover:border-white/30'
              }`}
            >
              {rel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
