/**
 * API Functional Tests — RetailAPIGuardian
 *
 * Tests all REST API endpoints for correct status codes, response
 * structure, and business-logic data integrity.
 */

import { test, expect } from "./fixtures.js";

// ─── Health Endpoint ───────────────────────────────────────────

test.describe("GET /health", () => {
  test("returns 200 with healthy status", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/health`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("RetailAPIGuardian");
    expect(body.version).toBe("1.0.0");
    expect(body.timestamp).toBeTruthy();
  });
});

// ─── Integrations Endpoint ─────────────────────────────────────

test.describe("GET /api/integrations", () => {
  test("returns all 3 vendor integrations", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/integrations`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.integrations).toHaveLength(3);
  });

  test("each integration has required fields", async ({ baseURL }) => {
    const { integrations } = await fetch(`${baseURL}/api/integrations`).then(
      (r) => r.json()
    );

    for (const vendor of integrations) {
      expect(vendor).toHaveProperty("vendor");
      expect(vendor).toHaveProperty("status");
      expect(vendor).toHaveProperty("latencyMs");
      expect(vendor).toHaveProperty("errorRate");
      expect(vendor).toHaveProperty("lastChecked");
    }
  });

  test("vendors are Stripe, Shippo, LoyaltyAPI", async ({ baseURL }) => {
    const { integrations } = await fetch(`${baseURL}/api/integrations`).then(
      (r) => r.json()
    );
    const names = integrations.map((i: { vendor: string }) => i.vendor);
    expect(names).toContain("Stripe");
    expect(names).toContain("Shippo");
    expect(names).toContain("LoyaltyAPI");
  });

  test("Shippo status is degraded", async ({ baseURL }) => {
    const { integrations } = await fetch(`${baseURL}/api/integrations`).then(
      (r) => r.json()
    );
    const shippo = integrations.find(
      (i: { vendor: string }) => i.vendor === "Shippo"
    );
    expect(shippo.status).toBe("degraded");
    expect(shippo.latencyMs).toBeGreaterThan(200);
  });
});

// ─── Changes Endpoint ──────────────────────────────────────────

test.describe("GET /api/changes", () => {
  test("returns pending API changes", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/changes`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.changes).toHaveLength(3);
  });

  test("changes have severity levels", async ({ baseURL }) => {
    const { changes } = await fetch(`${baseURL}/api/changes`).then((r) =>
      r.json()
    );
    const severities = changes.map((c: { severity: string }) => c.severity);
    expect(severities).toContain("critical");
    expect(severities).toContain("high");
    expect(severities).toContain("medium");
  });

  test("each change has vendor, severity, summary, deadline", async ({
    baseURL,
  }) => {
    const { changes } = await fetch(`${baseURL}/api/changes`).then((r) =>
      r.json()
    );

    for (const change of changes) {
      expect(change).toHaveProperty("vendor");
      expect(change).toHaveProperty("severity");
      expect(change).toHaveProperty("summary");
      expect(change).toHaveProperty("deadline");
    }
  });
});

// ─── Deployments Endpoint ──────────────────────────────────────

test.describe("GET /api/deployments", () => {
  test("returns deployments array", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/deployments`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.deployments)).toBe(true);
  });
});

// ─── Fabric IQ Dashboard API ───────────────────────────────────

test.describe("GET /api/dashboard/summary", () => {
  test("returns computed dashboard summary", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/dashboard/summary`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("overallReliabilityPercent");
    expect(body).toHaveProperty("vendorScores");
    expect(body).toHaveProperty("totalChangesDetected");
    expect(body).toHaveProperty("deploymentSuccessRate");
    expect(body).toHaveProperty("totalCostSavingsUSD");
    expect(body).toHaveProperty("mttdMinutes");
    expect(body).toHaveProperty("mttfMinutes");
  });

  test("vendor scores include all 3 vendors", async ({ baseURL }) => {
    const body = await fetch(`${baseURL}/api/dashboard/summary`).then((r) =>
      r.json()
    );
    expect(body.vendorScores.length).toBeGreaterThanOrEqual(3);

    const vendors = body.vendorScores.map((v: { vendor: string }) => v.vendor);
    expect(vendors).toContain("Stripe");
    expect(vendors).toContain("Shippo");
    expect(vendors).toContain("LoyaltyAPI");
  });

  test("reliability is between 0 and 100", async ({ baseURL }) => {
    const body = await fetch(`${baseURL}/api/dashboard/summary`).then((r) =>
      r.json()
    );
    expect(body.overallReliabilityPercent).toBeGreaterThanOrEqual(0);
    expect(body.overallReliabilityPercent).toBeLessThanOrEqual(100);
  });
});

test.describe("GET /api/dashboard/health-trends", () => {
  test("returns array of health trend records", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/dashboard/health-trends`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(100); // 30 days × 3 vendors × 6/day

    const first = body[0];
    expect(first).toHaveProperty("timestamp");
    expect(first).toHaveProperty("vendor");
    expect(first).toHaveProperty("status");
    expect(first).toHaveProperty("latencyMs");
  });
});

test.describe("GET /api/dashboard/changes", () => {
  test("returns array of change metrics", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/dashboard/changes`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const first = body[0];
    expect(first).toHaveProperty("vendor");
    expect(first).toHaveProperty("severity");
    expect(first).toHaveProperty("changeType");
    expect(first).toHaveProperty("detectionTimeMinutes");
  });
});

test.describe("GET /api/dashboard/deployments", () => {
  test("returns array of deployment metrics", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/dashboard/deployments`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const first = body[0];
    expect(first).toHaveProperty("vendor");
    expect(first).toHaveProperty("environment");
    expect(first).toHaveProperty("strategy");
    expect(first).toHaveProperty("success");
  });
});

test.describe("GET /api/dashboard/cost-savings", () => {
  test("returns cost savings data", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/dashboard/cost-savings`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(4); // 4 weeks

    const first = body[0];
    expect(first).toHaveProperty("period");
    expect(first).toHaveProperty("manualHoursAvoided");
    expect(first).toHaveProperty("estimatedSavingsUSD");
    expect(first.estimatedSavingsUSD).toBeGreaterThan(0);
  });
});

// ─── Cross-Cutting Concerns ───────────────────────────────────

test.describe("API robustness", () => {
  test("404 for unknown route", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/api/nonexistent`);
    expect(res.status).toBe(404);
  });

  test("health endpoint responds under 200ms", async ({ baseURL }) => {
    const start = Date.now();
    await fetch(`${baseURL}/health`);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  test("JSON content-type on API endpoints", async ({ baseURL }) => {
    const endpoints = [
      "/health",
      "/api/integrations",
      "/api/changes",
      "/api/deployments",
      "/api/dashboard/summary",
    ];

    for (const endpoint of endpoints) {
      const res = await fetch(`${baseURL}${endpoint}`);
      expect(res.headers.get("content-type")).toContain("application/json");
    }
  });
});
