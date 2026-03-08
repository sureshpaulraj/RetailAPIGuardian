# RetailAPIGuardian — 3-Minute Demo Script

## Overview
- **Duration**: 3 minutes
- **Audience**: Enterprise challenge judges
- **Goal**: Show end-to-end API integration management with GitHub Copilot SDK — including dashboards, OpenAPI docs, conversational agent, and automated workflows

## Pre-Demo Setup
1. Terminal open in project root
2. `npm run dashboard` running (Express backend with Fabric IQ dashboard + Swagger UI)
3. `npm run dashboard:ui` running (React Connector Health Dashboard via Vite)
4. Browser tabs pre-loaded:
   - **Fabric IQ Dashboard**: http://localhost:3000/dashboard
   - **Swagger UI (API Docs)**: http://localhost:3000/api-docs
   - **Connector Health Dashboard**: http://localhost:5173
5. Agent ready: `npm start`

## Demo Flow

### Act 1: The Problem (0:00–0:25)
**Narration**: "Retail engineering teams spend 40+ hours per month maintaining vendor API integrations — payment processors like Stripe, shipping carriers like Shippo, loyalty platforms. When a vendor pushes a breaking API change, it takes days to detect, code, test, and deploy fixes. RetailAPIGuardian automates this entire lifecycle."

**Action**: Show the Fabric IQ dashboard — highlight the 99.7% health score, 10 changes detected, 88.9% deployment success rate, and $21K monthly savings.

### Act 2: Dashboards & API Docs (0:25–0:55)
**Action**: Switch to Swagger UI tab at `/api-docs`

**Narration**: "The platform exposes a full OpenAPI 3.0.3 compliant REST API with interactive Swagger UI documentation. Every endpoint — health checks, connector management, integrations, change detection, deployments — is documented with schemas and try-it-out support."

**Action**: Expand the `/health` endpoint and click "Try it out" → "Execute" to show a live response.

**Action**: Switch to the React Connector Health Dashboard at `:5173`

**Narration**: "The Connector Health Dashboard gives real-time visibility into all vendor integrations. We can see Stripe and LoyaltyAPI are healthy, while Shippo is flagged as slow at 320ms. From here, teams can trigger rechecks, view history, and run breakage analysis."

### Act 3: Conversational Agent — Health Check (0:55–1:20)
**Command**: `health`
**Expected Output**: All 3 vendors with status, latency, error rates in a formatted table.

```
╔════════════════════════════════════════════════════════╗
║              Vendor Integration Health                  ║
╠════════════════════════════════════════════════════════╣
║ Vendor       │ Status    │ Latency │ Error Rate │ Last ║
╠════════════════════════════════════════════════════════╣
║ Stripe       │ ✅ Healthy │  45ms   │   0.1%     │ now  ║
║ Shippo       │ ⚠️ Degraded│ 320ms   │   5.0%     │ now  ║
║ LoyaltyAPI   │ ✅ Healthy │  78ms   │   0.2%     │ now  ║
╚════════════════════════════════════════════════════════╝
```

**Narration**: "The same data is available through our conversational agent built with the GitHub Copilot SDK. A single command gives real-time health across all integrations. Shippo is degraded — the agent flags it immediately."

### Act 4: Change Detection & Auto-Fix (1:20–2:10)
**Command**: `changes`
**Expected Output**: Severity-sorted list with critical and high changes at the top.

**Narration**: "The agent monitors vendor changelogs and OpenAPI spec diffs. It's detected a critical Stripe breaking change — the `source` parameter is being removed in favor of `payment_method`. Deadline: April 1st."

**Command**: `fix`
**Expected Output**: Generated TypeScript adapter code with retry logic, types, and changelog.

**Narration**: "The agent generates updated adapter code with enterprise patterns — retry with exponential backoff, proper TypeScript types, and backward compatibility."

**Command**: `test`
**Expected Output**: Tests pass against vendor sandbox.

**Narration**: "All tests pass against the sandbox. The adapter is validated and ready for deployment."

### Act 5: Safe Deployment (2:10–2:35)
**Command**: `deploy`
**Expected Output**: Canary deployment to staging with step-by-step progress.

**Narration**: "Deploy to staging with a canary strategy. The agent requires human approval for production — responsible AI in action. If anything fails, automatic rollback kicks in. The full pipeline is defined in our GitHub Actions CI/CD workflow."

### Act 6: Wrap-Up (2:35–3:00)
**Narration**: "RetailAPIGuardian: from detection to deployment in minutes, not days. Built with the GitHub Copilot SDK's `defineTool()` API, backed by Azure infrastructure, with dual dashboards for analytics and connector management, full OpenAPI compliance, and 35 automated Playwright tests. Enterprise-grade, production-ready, responsible AI built in."

**Action**: Quick flash of the Fabric IQ dashboard one final time showing updated metrics.

## Key Points to Emphasize
- **GitHub Copilot SDK**: 5 custom tools via `defineTool()` — health, changes, fix, test, deploy
- **Dual Dashboards**: Fabric IQ analytics dashboard + React Connector Health Dashboard
- **OpenAPI 3.0.3**: Full spec with interactive Swagger UI at `/api-docs`
- **REST API**: Connector endpoints (list, recheck, history, breakage analysis) + integrations, changes, deployments
- **Azure Integration**: Bicep IaC (App Service, PostgreSQL, Redis, Key Vault, App Gateway, VNet, App Insights)
- **Enterprise Patterns**: Retry with exponential backoff, circuit breaker, human-in-the-loop
- **Responsible AI**: Human approval for production, full audit trail, PCI DSS awareness
- **Work IQ**: Teams notifications via adaptive cards for critical changes
- **Fabric IQ**: Analytics engine with health trends, deployment tracking, cost savings
- **Testing**: 35 Playwright tests (19 API + 16 dashboard) with isolated fixture-based server
- **CI/CD**: GitHub Actions pipeline — lint → typecheck → test → deploy-staging → deploy-production
