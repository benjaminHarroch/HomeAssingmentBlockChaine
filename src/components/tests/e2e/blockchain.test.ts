import { test, expect } from "@playwright/test";

test("Homepage loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.getByText("Blockchain Investigator")).toBeVisible();

  await expect(page.getByRole("button", { name: "Fetch" })).toBeVisible();
});

test("Fetches Bitcoin transactions and shows graph", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.fill("input[placeholder='Enter Bitcoin address']", "1BoatSLRHtKNngkdXEeobR76b53LETtpyT");
  await page.click("text=Fetch");
  await expect(page.getByText(/Loading/i)).toBeVisible();
  await page.waitForSelector("[data-testid='graph-container']", { timeout: 15000 });
  const graph = await page.locator("[data-testid='graph-container']");
  await expect(graph).toBeVisible();
});
