import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactD3Innovations',
      formats: ['es', 'umd'],
      fileName: (format) => `react-d3-innovations.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'd3'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'd3': 'd3',
        },
      },
    },
  },
});