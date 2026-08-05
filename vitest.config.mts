import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    testTimeout: 10000,
    // e2e/ is Playwright's; it imports @playwright/test, which Vitest cannot
    // run. `.next` is excluded too because `output: "standalone"` copies the
    // specs into the traced bundle, where they would be picked up again.
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**", ".next/**"],
  },
});
