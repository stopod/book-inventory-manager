/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // 他の環境変数もここに追加するわよ～
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
