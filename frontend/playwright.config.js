// @ts-check
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { outputFolder: "playwright-report" }]]
    : "list",
  use: {
    headless: true,
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    cwd: "./",
  },
});
