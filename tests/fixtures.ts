/**
 * Shared test fixture — starts the Express server on a random port
 * and provides `baseURL` to all tests.
 */

import { test as base, expect } from "@playwright/test";
import type { Server } from "http";

type ServerFixture = {
  baseURL: string;
  server: Server;
};

export const test = base.extend<ServerFixture>({
  // eslint-disable-next-line no-empty-pattern
  server: async ({}, use) => {
    // Dynamic import so tsx transpiles the server module
    const { default: app } = await import("../src/server.js");
    const server: Server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    await use(server);
    await new Promise<void>((resolve) => server.close(() => resolve()));
  },

  baseURL: async ({ server }, use) => {
    const addr = server.address();
    const port = typeof addr === "object" && addr ? addr.port : 3000;
    await use(`http://localhost:${port}`);
  },
});

export { expect };
