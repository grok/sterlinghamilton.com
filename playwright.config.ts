import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  use: {
    // Dedicated port to avoid colliding with any dev/preview servers.
    baseURL: 'http://localhost:4400',
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
  },
  webServer: {
    // Keep this simple & fast: run the Astro dev server.
    // (You can switch to `bun run build && bun run preview` later for CI stability.)
    command: 'bun run dev -- --port 4400 --host 127.0.0.1',
    url: 'http://localhost:4400',
    // If a server is already running on this port, reuse it.
    // This makes local iteration reliable even if you forget to stop a dev server.
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'chromium-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
  ],
});
