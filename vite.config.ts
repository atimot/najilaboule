import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: リポジトリ名を設定（例: /najilaboule/）
  // ルートドメインの場合は '/' のままでOK
  base: '/najilaboule/',
  server: {
    host: true, // LAN内の他デバイスからアクセス可能にする
  },
})
