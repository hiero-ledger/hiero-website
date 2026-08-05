import { defineConfig, devices } from "@playwright/test";

/**
 * Browser-level checks for things jsdom cannot see.
 *
 * Unit tests assert that a component *emits* a class; only a real browser
 * resolves what that class actually does once the cascade has had its say.
 * Every regression these guard against shipped green through lint, Prettier
 * and the vitest suite.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Runs against the production build, so the CSS under test is the CSS we ship.
    // CI builds in an earlier step, so `start` finds .next already there.
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
