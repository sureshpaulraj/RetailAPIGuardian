/**
 * RetailAPIGuardian Dashboard Server
 *
 * Express server providing a simple REST API and health endpoint
 * for the integration monitoring dashboard. In production, this
 * serves the dashboard UI and proxies requests to the agent.
 */

import express from "express";
import { createDashboardRouter } from "./fabriciq/dashboard-routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(
    `🛡️  RetailAPIGuardian Dashboard running at http://localhost:${PORT}`
  );
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Integrations: http://localhost:${PORT}/api/integrations`);
  console.log(`   Changes: http://localhost:${PORT}/api/changes`);
});

export default app;
