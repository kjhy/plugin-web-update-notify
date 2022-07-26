import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { webUpdateNotice } from "@plugin-web-update-notify/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      logVersion: true,
      checkInterval: 0.5 * 60 * 1000,
      notifyProps: {
        title: "system update",
        description: "System update, please refresh the page",
        buttonText: "refresh",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
