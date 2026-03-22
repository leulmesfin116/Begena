import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Keep in sync with docker-compose.yml frontend ports (5173:5173)
    port: 5173,
    host: true,
    strictPort: true,
  },
});
