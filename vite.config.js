import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          filename: 'index.html',
          template: 'index.html',
          entry: 'src/main.tsx',
        },
        {
          filename: 'newtab.html',
          template: 'newtab.html',
          entry: 'src/main.tsx',
        }
      ]
    })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    outDir: 'extension',
    cssCodeSplit: false,
  },
})
