'use client';

import React from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { ThemeName } from '@/types';
import { allThemes } from '@/lib/themes';

export function ThemeSelector() {
  const { theme, setTheme } = useMapContext();

  return (
    <div className="grid grid-cols-2 gap-2">
      {allThemes.map((t) => {
        const isSelected = theme === t.name;
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name as ThemeName)}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-current scale-105 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={
              isSelected
                ? { borderColor: t.colors.primary }
                : {}
            }
          >
            <div className="flex items-center space-x-2 mb-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: t.colors.primary }}
              />
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: t.colors.secondary }}
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">{t.displayName}</div>
              <div className="text-xs text-gray-500 truncate">{t.mood}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
