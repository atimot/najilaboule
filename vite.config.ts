import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), tailwindcss()],
  // GitHub Pages用: リポジトリ名を設定（例: /najilaboule/）
  // ルートドメインの場合は '/' のままでOK
  base: '/najilaboule/',
  server: {
    host: true, // LAN内の他デバイスからアクセス可能にする
  },
})
