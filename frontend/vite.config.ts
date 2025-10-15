// frontend/vite.config.ts

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
  // ,
  // server: {
  //   host: "0.0.0.0", // برای اینکه از بیرون کانتینر هم قابل دسترس باشه
  //   allowedHosts: ["ehsan.darkube.app"], // هاست مجاز
  //   port: 5173, // (اختیاری) اگر پورتی خاص می‌خوای تنظیم کن
  // },
})
