/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_PLACEMENT_MODE?: string;
  readonly VITE_AMBIENT_AUDIO_URL?: string;
  readonly VITE_MAP_MIN_ZOOM?: string;
  readonly VITE_MAP_MAX_ZOOM?: string;
  readonly VITE_MAP_TILE_SOURCE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
