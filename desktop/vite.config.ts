import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/renderer/index.html'),
        'region-picker': path.resolve(__dirname, 'src/renderer/region-picker.html')
      }
    }
  },
  server: { port: 5173, strictPort: true }
});
