import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  // Evita depender do cwd (no Windows/IDE isso pode variar e quebrar resolução de imports/aliases)
  root: __dirname,
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: undefined,
      },
    },
    // Module Federation no Vite funciona de forma mais confiável com ES2022
    // (é o padrão recomendado pela própria doc do repo).
    target: 'es2022',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    host: '::',
    port: 5173,
  },
  preview: {
    host: '::',
    port: 4175,
  },
  plugins: [
    react(),
    federation({
      name: 'devshaper_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/remote-exports/Dashboard.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.26.2'
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: '^5.56.2'
        },
      } as Record<string, { singleton: boolean; requiredVersion: string }>,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
