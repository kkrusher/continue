import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "../cline/src"),
      "@api": resolve(__dirname, "../cline/src/api"),
      "@core": resolve(__dirname, "../cline/src/core"),
      "@integrations": resolve(__dirname, "../cline/src/integrations"),
      "@services": resolve(__dirname, "../cline/src/services"),
      "@shared": resolve(__dirname, "../cline/src/shared"),
      "@utils": resolve(__dirname, "../cline/src/utils"),
      "@packages": resolve(__dirname, "../cline/src/packages"),
      "@webview-ui": resolve(__dirname, "./src/cline-webview-ui-src"),
    },
  },
  build: {
    // Change the output .js filename to not include a hash
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        indexConsole: resolve(__dirname, "indexConsole.html"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["*", "Content-Type", "Authorization"],
      credentials: true,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/util/test/setupTests.ts",
  },
});
