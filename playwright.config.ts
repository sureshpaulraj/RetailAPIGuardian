import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:0", // overridden per-test via server fixture
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "api",
      testMatch: /api\.spec\.ts/,
    },
    {
      name: "dashboard",
      testMatch: /dashboard\.spec\.ts/,
      use: { browserName: "chromium" },
    },
  ],
});
