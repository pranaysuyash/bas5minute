'use client';

import React, { useState, useEffect } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import {
  calculateIsochroneAreaSqKm,
  calculateRealityScore,
  getCityTrafficJoke,
  ACHIEVEMENTS,
  type Achievement,
} from '@/lib/utils';

const STORAGE_KEY = 'bas5minute_achievements';
const STORAGE_KEY_COUNT = 'bas5minute_map_count';

export function StatsPanel() {
  const { location, mode, duration, theme, isochroneData, desiMode } = useMapContext();
  const colors = getThemeColors(theme);
  
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [mapCount, setMapCount] = useState(0);
  const [showJoke, setShowJoke] = useState(true);
  
  const areaSqKm = isochroneData ? calculateIsochroneAreaSqKm(isochroneData) : 0;
  const realityScore = isochroneData && location
    ? calculateRealityScore(duration, areaSqKm, mode, location.city)
    : null;
  
  const trafficJoke = getCityTrafficJoke(location?.city);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUnlockedAchievements(JSON.parse(stored));
    }
    const count = localStorage.getItem(STORAGE_KEY_COUNT);
    if (count) {
      setMapCount(parseInt(count, 10));
    }
  }, []);

  useEffect(() => {
    if (isochroneData) {
      const newAchievements = [...unlockedAchievements];
      let changed = false;

      const addAchievement = (id: string) => {
        if (!newAchievements.includes(id)) {
          newAchievements.push(id);
          changed = true;
        }
      };

      addAchievement('first_map');
      
      const newCount = mapCount + 1;
      setMapCount(newCount);
      localStorage.setItem(STORAGE_KEY_COUNT, newCount.toString());
      
      if (newCount >= 10) addAchievement('optimist');
      if (newCount >= 50) addAchievement('reality_check');

      if (mode === 'walking') addAchievement('walker');
      if (mode === 'cycling') addAchievement('cyclist');

      if (location?.city?.toLowerCase() === 'bangalore' || location?.city?.toLowerCase() === 'bengaluru') {
        addAchievement('bangalore_survivor');
      }
      if (location?.city?.toLowerCase() === 'mumbai') {
        addAchievement('mumbai_mermaid');
      }
      if (location?.city?.toLowerCase() === 'delhi' || location?.city?.toLowerCase() === 'new delhi') {
        addAchievement('delhi_daredevil');
      }

      if (desiMode) addAchievement('desi_mode');

      const hour = new Date().getHours();
      if (hour >= 0 && hour < 6) addAchievement('night_owl');
      if (hour >= 4 && hour < 6) addAchievement('early_bird');

      if (changed) {
        setUnlockedAchievements(newAchievements);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAchievements));
      }
    }
  }, [isochroneData, mode, location?.city, desiMode, mapCount, unlockedAchievements]);

  if (!isochroneData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 space-y-3">
        <div className="text-center text-gray-500 text-sm">
          Generate a map to see your stats!
        </div>
        {showJoke && (
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700 italic">"{trafficJoke}"</p>
            <button
              type="button"
              onClick={() => setShowJoke(false)}
              className="text-xs text-gray-500 hover:text-gray-700 mt-2"
            >
              Hide
            </button>
          </div>
        )}
      </div>
    );
  }

  const unlockedCount = unlockedAchievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4">
      {/* Reality Score */}
      {realityScore && (
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-gray-600 uppercase">Reality Score</div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-4xl">{realityScore.emoji}</span>
            <div>
              <div className="text-3xl font-black" style={{ color: colors.primary }}>
                {realityScore.score}%
              </div>
              <div className="text-sm font-bold text-gray-700">{realityScore.rating}</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 italic">{realityScore.description}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xl font-black" style={{ color: colors.primary }}>
            {areaSqKm.toFixed(1)}
          </div>
          <div className="text-[10px] text-gray-600">km² area</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xl font-black" style={{ color: colors.secondary }}>
            {mapCount}
          </div>
          <div className="text-[10px] text-gray-600">maps made</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xl font-black" style={{ color: colors.accent }}>
            {unlockedCount}/{totalAchievements}
          </div>
          <div className="text-[10px] text-gray-600">badges</div>
        </div>
      </div>

      {/* Traffic Joke */}
      <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-3 text-center">
        <p className="text-sm text-gray-700 italic">"{trafficJoke}"</p>
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-600 uppercase">Achievements</div>
        <div className="flex flex-wrap gap-1">
          {ACHIEVEMENTS.slice(0, 8).map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition ${
                  isUnlocked
                    ? 'bg-yellow-100'
                    : 'bg-gray-100 opacity-40'
                }`}
                title={`${achievement.name}: ${achievement.description}${isUnlocked ? ' ✓' : ' (locked)'}`}
              >
                {achievement.emoji}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
