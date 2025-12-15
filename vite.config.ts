import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  server: {
    host: '::',
    port: 5173,
    proxy: {
      '/api/judge0': {
        target: process.env.VITE_JUDGE0_API_URL || 'https://judge0.devfellowship.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/judge0/, ''),
      },
    },
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
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '6.26.2',
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: '^5.56.2',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
})
