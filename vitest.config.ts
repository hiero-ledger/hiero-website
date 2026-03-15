import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDirectory, "src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    pool: "threads",
    restoreMocks: true,
    setupFiles: ["./src/test/setup.tsx"],
  },
});
