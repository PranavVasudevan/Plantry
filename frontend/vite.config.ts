import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite automatically exposes any env var prefixed with VITE_ via
// import.meta.env — no manual `define` block needed (and no risk of
// accidentally leaking a non-prefixed secret into the client bundle,
// which the previous config's GEMINI_API_KEY exposure did).
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});