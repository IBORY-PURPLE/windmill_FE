// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react({
      babel: {
        presets: [["@babel/preset-react", { runtime: "automatic" }]],
      },
    }),
  ],
});
