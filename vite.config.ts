import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json';
import { dirname, generateScopedName } from './scripts/devUtils.js';

const __dirname = dirname(import.meta.url);
const peerDeps = Object.keys(pkg.peerDependencies).concat(['react/jsx-runtime']);

const config = defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es', 'cjs'],
      fileName: 'main',
    },
    rollupOptions: { external: peerDeps },
  },
  plugins: [react()],
  css: { modules: { generateScopedName } },
});

export default config;
