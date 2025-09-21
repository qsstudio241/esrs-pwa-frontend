// @ts-check
import { defineConfig } from "@playwright/test";

const baseURL = process.env.PW_BASE_URL || "http://localhost:3000";

// Configure optional webServer behavior:
// - If PW_EXTERNAL_URL is set, do not start a web server (assume external site)
// - Else if PW_USE_WEBSERVER=1, start with PW_WEB_SERVER_COMMAND on PW_WEB_SERVER_PORT
// - Else default to dev server on port 3000
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
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
    baseURL,
    trace: "on-first-retry",
  },
};

if (!process.env.PW_EXTERNAL_URL) {
  if (process.env.PW_USE_WEBSERVER === "1") {
    config.webServer = {
      command: process.env.PW_WEB_SERVER_COMMAND || "",
      port: Number(process.env.PW_WEB_SERVER_PORT || 3000),
      reuseExistingServer: !process.env.CI,
      cwd: "./",
    };
  } else {
    config.webServer = {
      command: "npm start",
      port: 3000,
      reuseExistingServer: !process.env.CI,
      cwd: "./",
    };
  }
}

export default defineConfig(config);
