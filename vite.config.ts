import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    svgr(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["src/assets/*", "public/*"],
      manifest: {
        background_color: "#1B1E22",
        theme_color: "#1B1E22",
        display: "standalone",
        name: "Stratagem Hero",
        short_name: "Stratagem Hero",
        start_url: "/",

        icons: [
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        orientation: "portrait",
      },
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: "local",
    },
  },
});
