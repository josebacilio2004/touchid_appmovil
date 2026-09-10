import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Asegura rutas relativas para que funcione en subcarpetas de GitHub Pages
  build: {
    outDir: '../docs',
    emptyOutDir: true, // Limpia la carpeta docs antes de generar la nueva build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quiz: resolve(__dirname, 'quiz.html'),
      }
    }
  }
});
