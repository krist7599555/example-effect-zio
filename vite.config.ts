import { defineConfig } from "vite";
import { effectPlugin } from "@effect-app/compiler/vitePlugin2";
export default defineConfig({
  build: {
    rollupOptions: {
      input: ["./src/index.ts"],
    },
  },
  plugins: [
    effectPlugin({
      enableCache: true,
      enableTempFiles: false,
    }),
  ],
});
