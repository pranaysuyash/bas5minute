'use client';

import React from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { TimeDuration } from '@/types';
import { getThemeColors } from '@/lib/themes';

const durations: TimeDuration[] = [5, 10, 20, 30];

export function DurationSelector() {
  const { duration, setDuration, theme } = useMapContext();
  const colors = getThemeColors(theme);

  return (
    <div className="grid grid-cols-4 gap-2">
      {durations.map((d) => {
        const isSelected = duration === d;
        return (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`py-3 rounded-lg border-2 transition-all font-bold ${
              isSelected
                ? 'border-current scale-105 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={isSelected ? { borderColor: colors.primary, color: colors.primary } : {}}
          >
            {d}m
          </button>
        );
      })}
    </div>
  );
}
