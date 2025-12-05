/// <reference types="vite/client" />

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY?: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly MODE: string;
  }
}

export {};