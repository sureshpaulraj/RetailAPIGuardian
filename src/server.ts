/**
 * RetailAPIGuardian Dashboard Server
 *
 * Express server providing a simple REST API and health endpoint
 * for the integration monitoring dashboard. In production, this
 * serves the dashboard UI and proxies requests to the agent.
 */

import express from "express";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { createDashboardRouter } from "./fabriciq/dashboard-routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// ── OpenAPI docs at /api-docs ───────────────────────────────────
const specPath = resolve(
  __dirname,
  "../specs/001-mr-dashboard/contracts/connector-dashboard.openapi.yaml"
);
const openapiSpec = YAML.parse(readFileSync(specPath, "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/openapi.yaml", (_req, res) => {
  res.type("text/yaml").send(readFileSync(specPath, "utf-8"));
});

// Fabric IQ analytics dashboard
app.use(createDashboardRouter());

// Health endpoint for Azure Monitor / load balancer
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "RetailAPIGuardian",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Integration status summary endpoint
app.get("/api/integrations", (_req, res) => {
  // In production, this queries Cosmos DB for latest health check results
  res.json({
    integrations: [
      {
        vendor: "Stripe",
        status: "healthy",
        latencyMs: 45,
        errorRate: 0.001,
        lastChecked: new Date().toISOString(),
      },
      {
        vendor: "Shippo",
        status: "degraded",
        latencyMs: 320,
        errorRate: 0.05,
        lastChecked: new Date().toISOString(),
      },
      {
        vendor: "LoyaltyAPI",
        status: "healthy",
        latencyMs: 78,
        errorRate: 0.002,
        lastChecked: new Date().toISOString(),
      },
    ],
  });
});

// Pending API changes endpoint
app.get("/api/changes", (_req, res) => {
  // In production, this queries Cosmos DB for detected API changes
  res.json({
    changes: [
      {
        vendor: "Stripe",
        severity: "high",
        summary: "Payment Intents: source → payment_method migration",
        deadline: "2025-04-01",
      },
      {
        vendor: "LoyaltyAPI",
        severity: "critical",
        summary: "OAuth2 required for all endpoints",
        deadline: "2025-03-15",
      },
      {
        vendor: "Shippo",
        severity: "medium",
        summary: "v1/rates deprecated, migrate to v2/rates",
        deadline: "2025-06-01",
      },
    ],
  });
});

// Recent deployments endpoint
app.get("/api/deployments", (_req, res) => {
  res.json({ deployments: [] });
});

// ── Connector Dashboard API (matches OpenAPI contract) ─────────

// Shared connector data — maps vendor integrations to the connector schema
const statusMap: Record<string, "good" | "slow" | "broken"> = {
  healthy: "good",
  degraded: "slow",
  down: "broken",
};

function getConnectors() {
  return [
    {
      id: "stripe",
      name: "Stripe",
      currentStatus: "good" as const,
      lastCheckedAt: new Date().toISOString(),
      latencyMs: 45,
    },
    {
      id: "shippo",
      name: "Shippo",
      currentStatus: "slow" as const,
      lastCheckedAt: new Date().toISOString(),
      latencyMs: 320,
    },
    {
      id: "loyalty-api",
      name: "LoyaltyAPI",
      currentStatus: "good" as const,
      lastCheckedAt: new Date().toISOString(),
      latencyMs: 78,
    },
  ];
}

// GET /api/connectors — list all connectors with health status
app.get("/api/connectors", (_req, res) => {
  res.json({
    generatedAt: new Date().toISOString(),
    connectors: getConnectors(),
  });
});

// POST /api/connectors/recheck — request a health recheck
const recheckRequests = new Map<
  string,
  { requestId: string; status: string; submittedAt: string; completedAt: string | null; results: ReturnType<typeof getConnectors> }
>();

app.post("/api/connectors/recheck", (req, res) => {
  const { scope, connectorIds } = req.body ?? {};
  const requestId = `rchk-${Date.now()}`;
  const connectors = getConnectors();
  const results =
    scope === "selected" && Array.isArray(connectorIds)
      ? connectors.filter((c) => connectorIds.includes(c.id))
      : connectors;

  const record = {
    requestId,
    status: "completed",
    submittedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    results,
  };
  recheckRequests.set(requestId, record);
  res.status(202).json(record);
});

// GET /api/connectors/recheck/:requestId — get recheck status
app.get("/api/connectors/recheck/:requestId", (req, res) => {
  const record = recheckRequests.get(req.params.requestId);
  if (!record) {
    res.status(404).json({ error: "Recheck request not found" });
    return;
  }
  res.json(record);
});

// GET /api/connectors/:connectorId/history — health check history
app.get("/api/connectors/:connectorId/history", (req, res) => {
  const connector = getConnectors().find((c) => c.id === req.params.connectorId);
  if (!connector) {
    res.status(404).json({ error: "Connector not found" });
    return;
  }

  const limit = Math.min(Math.max(parseInt(String(req.query.limit)) || 50, 1), 200);
  const statuses: Array<"good" | "slow" | "broken"> = ["good", "good", "good", "slow", "good"];
  const results = Array.from({ length: limit }, (_, i) => ({
    id: `hc-${connector.id}-${i}`,
    status: connector.currentStatus === "slow" && i < 5 ? "slow" : statuses[i % statuses.length],
    latencyMs: connector.latencyMs! + Math.round((Math.random() - 0.5) * 40),
    errorRate: +(Math.random() * 0.01).toFixed(4),
    checkedAt: new Date(Date.now() - i * 15 * 60_000).toISOString(),
    details: `Routine health check #${limit - i}`,
  }));

  res.json({ connectorId: connector.id, results });
});

// POST /api/connectors/:connectorId/analysis — request breakage analysis
// GET  /api/connectors/:connectorId/analysis — get latest analysis
const analysisResults = new Map<string, object>();

app.post("/api/connectors/:connectorId/analysis", (req, res) => {
  const connector = getConnectors().find((c) => c.id === req.params.connectorId);
  if (!connector) {
    res.status(404).json({ error: "Connector not found" });
    return;
  }

  const analysis = {
    connectorId: connector.id,
    status: "completed",
    summary:
      connector.currentStatus === "slow"
        ? `${connector.name} is experiencing elevated latency due to vendor-side rate limiting on the v1/rates endpoint.`
        : `${connector.name} is operating normally. No breaking changes detected.`,
    rationale:
      connector.currentStatus === "slow"
        ? "Changelog shows v1/rates deprecated; vendor throttling legacy callers."
        : "All endpoints responding within SLA. No recent spec changes.",
    riskLevel: connector.currentStatus === "slow" ? "Medium" : "Low",
    recommendations:
      connector.currentStatus === "slow"
        ? [
            { title: "Migrate to v2/rates endpoint", description: "Update the Shippo adapter to use the v2/rates API which has higher rate limits.", confidence: 0.92 },
            { title: "Add retry with backoff", description: "Implement exponential backoff for transient 429 responses.", confidence: 0.85 },
          ]
        : [{ title: "No action required", description: "Continue monitoring.", confidence: 0.98 }],
    completedAt: new Date().toISOString(),
  };

  analysisResults.set(connector.id, analysis);
  res.status(202).json(analysis);
});

app.get("/api/connectors/:connectorId/analysis", (req, res) => {
  const existing = analysisResults.get(req.params.connectorId);
  if (existing) {
    res.json(existing);
    return;
  }
  res.status(404).json({ error: "No analysis available. Request one via POST." });
});

// Only start listening when run directly (not imported by tests)
const isDirectRun =
  process.argv[1]?.endsWith("server.ts") ||
  process.argv[1]?.endsWith("server.js");

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(
      `🛡️  RetailAPIGuardian Dashboard running at http://localhost:${PORT}`
    );
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`   Integrations: http://localhost:${PORT}/api/integrations`);
    console.log(`   Connectors:   http://localhost:${PORT}/api/connectors`);
    console.log(`   Changes: http://localhost:${PORT}/api/changes`);
  });
}

export default app;
