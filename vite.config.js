import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        customKeyboard3D: resolve(__dirname, "custom-keyboard-3D.html"),
      },
    },
  },
});