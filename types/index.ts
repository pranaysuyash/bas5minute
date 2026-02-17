// Core types for the Bas 5 Minute application

export type TravelMode = 'driving' | 'walking' | 'cycling';

export type TimeDuration = 5 | 10 | 20 | 30;

export type ThemeName = 'bollywood' | 'monsoon' | 'sandstone' | 'neon';

export type MapProvider = 'osm-liberty' | 'carto-voyager' | 'carto-positron' | 'carto-dark' | 'mapbox' | 'maptiler' | 'maplibre';

export type ExportFormat = 'social-square' | 'story-vertical' | 'poster-a4' | 'poster-a3' | 'transparent-png';

export type IsochroneProvider = 'ors' | 'valhalla' | 'backend';

export type ExportTemplate = 'map' | 'clean' | 'bollywood' | 'monsoon' | 'neon';

export type ExportFinishStyle = 'none' | 'studio-paper' | 'studio-neon' | 'studio-veins';

export type AIImageProvider = 'gemini' | 'fal' | 'replicate' | 'huggingface';

export type FilterType =
  | 'none'
  | 'vintage'
  | 'vibrant'
  | 'noir'
  | 'warm'
  | 'cool'
  | 'retro'
  | 'neon'
  | 'dreamy'
  | 'dramatic';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  mood: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
}

export interface IsochroneParams {
  location: Location;
  mode: TravelMode;
  duration: TimeDuration;
  smoothing?: number;
  provider?: IsochroneProvider;
}

export interface IsochroneData {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: Record<string, unknown> & {
      value?: number;
      center?: [number, number];
    };
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: number[][][] | number[][][][];
    };
  }>;
}

export interface Caption {
  id: string;
  text: string;
  category: 'sarcasm' | 'reality-check' | 'humor' | 'poetic' | 'minimal';
  language: 'english' | 'hinglish' | 'hindi';
}

export interface MapState {
  location: Location | null;
  mode: TravelMode;
  duration: TimeDuration;
  theme: ThemeName;
  desiMode: boolean;
  caption: string;
  isLoading: boolean;
  error: string | null;
  isochroneData: IsochroneData | null;
  mapProvider?: string;
  isoProvider?: string;
  geocodingProvider?: string;
  isochroneSmoothing: number;
  exportTemplate: ExportTemplate;
  exportFilter: FilterType;
  exportFinishStyle: ExportFinishStyle;
  exportIncludeCoordinates: boolean;
  exportIncludeTimestamp: boolean;
  aiImageProvider: AIImageProvider;
}

export interface ExportOptions {
  format: ExportFormat;
  theme: ThemeName;
  caption: string;
  includeWatermark: boolean;
  includeCoordinates: boolean;
  includeTimestamp: boolean;
}

export interface OrderFormData {
  email: string;
  theme: ThemeName;
  caption: string;
  format: ExportFormat;
  customText?: string;
  customLogo?: File;
  useCase: 'personal' | 'business' | 'gift';
  quantity: number;
}

export interface SupportOption {
  type: 'buymeacoffee' | 'github-sponsors' | 'gpay';
  url?: string;
  qrCode?: string;
  displayName: string;
}
