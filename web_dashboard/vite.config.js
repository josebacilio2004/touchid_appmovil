import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Asegura rutas relativas para que funcione en subcarpetas de GitHub Pages
  build: {
    outDir: '../docs',
    emptyOutDir: true, // Limpia la carpeta docs antes de generar la nueva build
  }
});
