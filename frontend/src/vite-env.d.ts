/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // You can add other environment variables here as you create them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}