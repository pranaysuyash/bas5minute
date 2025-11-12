'use client';

import React from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { TravelMode } from '@/types';
import { getModeIcon, getModeDisplayName } from '@/lib/utils';
import { getThemeColors } from '@/lib/themes';

const modes: TravelMode[] = ['driving', 'walking', 'cycling'];

export function ModeSelector() {
  const { mode, setMode, theme } = useMapContext();
  const colors = getThemeColors(theme);

  return (
    <div className="grid grid-cols-3 gap-2">
      {modes.map((m) => {
        const isSelected = mode === m;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-current scale-105 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={isSelected ? { borderColor: colors.primary, color: colors.primary } : {}}
          >
            <span className="text-2xl mb-1">{getModeIcon(m)}</span>
            <span className="text-xs font-medium">{getModeDisplayName(m)}</span>
          </button>
        );
      })}
    </div>
  );
}
