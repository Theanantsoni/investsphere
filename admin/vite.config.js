import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,              // 🔥 important for mobile access
    port: 5174,
    strictPort: true,        // same port force karega
  },

  preview: {
    host: true,
    port: 5174,
  },
});