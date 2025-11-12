import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/components/tests/e2e",
  timeout: 30000,
  use: {
    headless: true,
    baseURL: "http://localhost:3000",
    viewport: { width: 1280, height: 720 },
  },
});
