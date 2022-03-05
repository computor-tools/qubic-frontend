import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import license from 'rollup-plugin-license';
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), viteSingleFile()],

  optimizeDeps: {
    include: ['qubic-js'],
  },

  resolve: {
    alias: {
      events: path.join(dirname, 'node_modules', 'events'),
      util: path.join(dirname, 'node_modules', 'util'),
      path: path.join(dirname, 'node_modules', 'path-browserify'),
    },
  },

  build: {
    target: ['es2020'],
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      plugins: [
        license({
          sourcemap: true,
          thirdParty: {
            includePrivate: true,
            output: {
              file: path.join(dirname, 'dist', 'dependencies.txt'),
            },
          },
        }),
      ],
    },
  },
});
