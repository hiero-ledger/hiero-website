import { defineConfig, devices } from "@playwright/test";

/**
 * Browser-level checks for things jsdom cannot see.
 *
 * Unit tests assert that a component *emits* a class; only a real browser
 * resolves what that class actually does once the cascade has had its say.
 * Every regression these guard against shipped green through lint, Prettier
 * and the vitest suite.
 */
/**
 * Overridable so the suite can run beside a dev server. `reuseExistingServer`
 * adopts whatever already answers on this port — which is a trap on the default
 * one: a `pnpm dev` left running means the tests quietly grade a different
 * branch than the one you built. `PORT=3100 pnpm test:e2e` sidesteps it.
 */
const PORT = process.env.PORT ?? "3000";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Runs against the production build, so the CSS under test is the CSS we ship.
    // CI builds in an earlier step, so `start` finds .next already there.
    command: "pnpm start",
    url: BASE_URL,
    env: { PORT },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
