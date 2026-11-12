import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const projectRoot = fileURLToPath(new URL('../', import.meta.url));
  const env = loadEnv(mode, projectRoot, 'PORT');
  return {
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      proxy: { '/api': `http://127.0.0.1:${process.env.PORT || env.PORT || '3000'}` },
    },
    build: { outDir: 'dist' },
  };
});
