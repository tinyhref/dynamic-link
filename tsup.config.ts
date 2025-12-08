import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  minify: true,
  target: 'es2019',
  format: ['cjs', 'esm'],
  external: [
    'react-router',
    'qs'
  ],
  esbuildOptions(options) {
    options.drop = ['console'];
  }
});