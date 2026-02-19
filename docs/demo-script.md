# RetailAPIGuardian — 3-Minute Demo Script

## Overview
- **Duration**: 3 minutes
- **Audience**: Enterprise challenge judges
- **Goal**: Show end-to-end API integration management with GitHub Copilot SDK

## Pre-Demo Setup
- Terminal open in project root
- `npm run dashboard` running in background (shows Fabric IQ dashboard)
- Browser tab open to http://localhost:3000/dashboard

## Demo Flow

### Act 1: The Problem (0:00–0:30)
**Narration**: "Retail engineering teams spend 40+ hours per month maintaining vendor API integrations. When Stripe changes their payment API, it takes days to detect, code, test, and deploy fixes. RetailAPIGuardian automates this entire lifecycle."

**Action**: Show the Fabric IQ dashboard with health overview

### Act 2: Health Check (0:30–1:00)
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

**Narration**: "With a single command, we get real-time health across all vendor integrations. Shippo is showing degraded performance — the agent flags this immediately."

### Act 3: Change Detection (1:00–1:30)
**Command**: `changes`
**Expected Output**: Severity-sorted list with Stripe breaking change at top.

**Narration**: "The agent continuously monitors vendor changelogs. It's detected a critical Stripe breaking change — the `source` parameter is being removed in favor of `payment_method`. Deadline: April 1st."

### Act 4: Auto-Fix (1:30–2:15)
**Command**: `fix`
**Expected Output**: Generated TypeScript adapter code with retry logic, types, and changelog.

**Narration**: "The agent analyzes the change, generates updated adapter code with enterprise patterns — retry with exponential backoff, proper TypeScript types, and a detailed changes summary."

**Command**: `test`
**Expected Output**: 12 passed, 0 failed, 1 skipped for Stripe.

**Narration**: "All tests pass against the sandbox. The adapter is validated and ready for deployment."

### Act 5: Safe Deployment (2:15–2:45)
**Command**: `deploy`
**Expected Output**: Canary deployment to staging with step-by-step progress.

**Narration**: "Deploy to staging with a canary strategy. The agent requires human approval for production — responsible AI in action. If anything fails, automatic rollback."

### Act 6: Wrap-Up (2:45–3:00)
**Narration**: "RetailAPIGuardian: from detection to deployment in minutes, not days. Built with GitHub Copilot SDK, powered by Azure, governed by responsible AI principles."

**Action**: Show dashboard one final time with updated metrics

## Key Points to Emphasize
- **GitHub Copilot SDK**: 5 custom tools via `defineTool()`
- **Azure Integration**: Functions, Event Grid, Cosmos DB, API Management, Monitor, Key Vault
- **Enterprise Patterns**: Retry, circuit breaker, human-in-the-loop
- **Responsible AI**: Human approval for production, full audit trail
- **Work IQ**: Teams notifications for critical changes
- **Fabric IQ**: Analytics dashboard for health trends
