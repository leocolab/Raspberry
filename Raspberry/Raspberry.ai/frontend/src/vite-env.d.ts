/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FB_API: string;
  readonly VITE_FB_DOMAIN: string;
  readonly VITE_FB_PID: string;
  readonly VITE_FB_BUCKET: string;
  readonly VITE_FB_MSG: string;
  readonly VITE_FB_APPID: string;
  // add any other VITE_... env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}