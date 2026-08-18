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
    // Tests that spy on shared globals (window.addEventListener, say) otherwise
    // leave them patched for everything that runs after them in the same file.
    restoreMocks: true,
    // e2e/ is Playwright's; it imports @playwright/test, which Vitest cannot
    // run. `.next` is excluded too because `output: "standalone"` copies the
    // specs into the traced bundle, where they would be picked up again.
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**", ".next/**"],
  },
});
