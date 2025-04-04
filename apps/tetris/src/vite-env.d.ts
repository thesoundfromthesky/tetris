/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_HREF: string;
  readonly VITE_DETERMINISTIC_LOCK_STEP: boolean;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
