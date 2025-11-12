import { Theme, ThemeName } from '@/types';

export const themes: Record<ThemeName, Theme> = {
  bollywood: {
    name: 'bollywood',
    displayName: 'Bollywood',
    colors: {
      primary: '#FF4F7B',
      secondary: '#FFD166',
      accent: '#1C1C1C',
      background: '#FFF5F8',
      text: '#1C1C1C',
    },
    mood: 'Loud, festive, vibrant optimism',
  },
  monsoon: {
    name: 'monsoon',
    displayName: 'Monsoon',
    colors: {
      primary: '#009CA6',
      secondary: '#0E4E68',
      accent: '#F2F9FB',
      background: '#F2F9FB',
      text: '#0E4E68',
    },
    mood: 'Calm, reliable, romantic rain nostalgia',
  },
  sandstone: {
    name: 'sandstone',
    displayName: 'Sandstone',
    colors: {
      primary: '#FFC045',
      secondary: '#B64926',
      accent: '#F6EAD7',
      background: '#F6EAD7',
      text: '#B64926',
    },
    mood: 'Warm, grounded, heritage tone',
  },
  neon: {
    name: 'neon',
    displayName: 'Neon Nights',
    colors: {
      primary: '#C3FF00',
      secondary: '#00FFE0',
      accent: '#121212',
      background: '#121212',
      text: '#FFFFFF',
    },
    mood: 'Futuristic, nightlife sarcasm',
  },
};

export function getTheme(themeName: ThemeName): Theme {
  return themes[themeName];
}

export function getThemeColors(themeName: ThemeName) {
  return themes[themeName].colors;
}

export const allThemes = Object.values(themes);
