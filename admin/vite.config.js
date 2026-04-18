import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,                 // mobile + LAN access
    port: 5174,
    strictPort: true,

    // ✅ MAIN FIX (IMPORTANT)
    proxy: {
      "/api": {
        target: "http://localhost:5100", // backend server
        changeOrigin: true,
        secure: false,

        // optional but clean logging
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("➡️ Proxying:", req.method, req.url);
          });
        },
      },
    },
  },

  preview: {
    host: true,
    port: 5174,
  },

  // ✅ optional performance optimization
  optimizeDeps: {
    include: ["axios"],
  },

  build: {
    chunkSizeWarningLimit: 1000,
  },
});