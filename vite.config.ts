import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // GitHub Pages用: リポジトリ名を設定（例: /najilaboule/）
  // ルートドメインの場合は '/' のままでOK
  base: '/najilaboule/',
})
