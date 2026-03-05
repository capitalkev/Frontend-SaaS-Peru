/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL: string;
  // otras variables personalizadas pueden ir aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
