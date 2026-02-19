/**
 * Dashboard UI Functional Tests — RetailAPIGuardian
 *
 * Tests the Fabric IQ embedded HTML dashboard using Playwright browser
 * for visual rendering, data loading, and interactive elements.
 */

import { test, expect } from "./fixtures.js";

test.describe("Dashboard page — /dashboard", () => {
  test("loads and renders the page title", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);

    await expect(page).toHaveTitle("RetailAPIGuardian — Fabric IQ Dashboard");
  });

  test("displays the header with app name", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);

    const header = page.locator(".header h1");
    await expect(header).toContainText("RetailAPIGuardian");
    await expect(header).toContainText("Fabric IQ Dashboard");
  });

  test("shows LIVE badge in header", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);

    const badge = page.locator(".header .badge");
    await expect(badge).toContainText("LIVE");
  });

  test("loads and displays 4 KPI cards", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);

    // Wait for KPIs to load (replaces "Loading analytics…")
    await page.waitForSelector(".kpi", { timeout: 10_000 });

    const kpiCards = page.locator(".kpi");
    await expect(kpiCards).toHaveCount(4);
  });

  test("KPI cards show meaningful values", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector(".kpi", { timeout: 10_000 });

    // Health Score KPI should show a percentage
    const healthKpi = page.locator(".kpi").first();
    const healthValue = healthKpi.locator(".kpi-value");
    await expect(healthValue).toContainText("%");

    // Monthly Savings KPI should show a dollar amount
    const savingsKpi = page.locator(".kpi").last();
    const savingsValue = savingsKpi.locator(".kpi-value");
    await expect(savingsValue).toContainText("$");
  });

  test("vendor health table loads with 3 vendors", async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/dashboard`);

    // Wait for vendor table to populate
    await page.waitForSelector("#vendor-table table", { timeout: 10_000 });

    const vendorRows = page.locator("#vendor-table tbody tr");
    await expect(vendorRows).toHaveCount(3);

    // Check vendor names are present
    const tableText = await page.locator("#vendor-table").textContent();
    expect(tableText).toContain("Stripe");
    expect(tableText).toContain("Shippo");
    expect(tableText).toContain("LoyaltyAPI");
  });

  test("vendor health table shows status badges", async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector("#vendor-table table", { timeout: 10_000 });

    const statusBadges = page.locator("#vendor-table .status");
    const count = await statusBadges.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("changes table loads with severity badges", async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector("#changes-table table", { timeout: 10_000 });

    const changeRows = page.locator("#changes-table tbody tr");
    const count = await changeRows.count();
    expect(count).toBeGreaterThan(0);

    // Severity badges should be present
    const sevBadges = page.locator("#changes-table .sev");
    const sevCount = await sevBadges.count();
    expect(sevCount).toBeGreaterThan(0);
  });

  test("deployments table loads", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector("#deploy-table table", { timeout: 10_000 });

    const deployRows = page.locator("#deploy-table tbody tr");
    const count = await deployRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("cost savings table shows financial data", async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector("#savings-table table", { timeout: 10_000 });

    const savingsRows = page.locator("#savings-table tbody tr");
    const count = await savingsRows.count();
    expect(count).toBeGreaterThanOrEqual(4); // 4 weekly summaries

    // Should contain dollar amounts
    const tableText = await page.locator("#savings-table").textContent();
    expect(tableText).toContain("$");
  });

  test("footer shows Microsoft Fabric branding", async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/dashboard`);

    const footer = page.locator(".footer");
    await expect(footer).toContainText("Microsoft Fabric");
    await expect(footer).toContainText("15 minutes");
  });

  test("dashboard is responsive (no horizontal overflow)", async ({
    page,
    baseURL,
  }) => {
    // Test at tablet viewport (tables may overflow on phone-sized screens)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector(".kpi", { timeout: 10_000 });

    const bodyWidth = await page.evaluate(
      () => document.body.scrollWidth <= window.innerWidth
    );
    expect(bodyWidth).toBe(true);
  });

  test("all data loads without JavaScript errors", async ({
    page,
    baseURL,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(`${baseURL}/dashboard`);
    await page.waitForSelector(".kpi", { timeout: 10_000 });

    // Allow a brief moment for any deferred errors
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });
});

test.describe("Dashboard HTML response", () => {
  test("returns HTML content-type", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/dashboard`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  test("HTML includes required meta tags", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/dashboard`);
    const html = await res.text();

    expect(html).toContain('charset="utf-8"');
    expect(html).toContain("viewport");
    expect(html).toContain("<title>");
  });

  test("HTML includes inline styles (self-contained)", async ({
    baseURL,
  }) => {
    const res = await fetch(`${baseURL}/dashboard`);
    const html = await res.text();

    expect(html).toContain("<style>");
    // No external CSS links — fully self-contained
    expect(html).not.toContain('rel="stylesheet"');
  });
});
