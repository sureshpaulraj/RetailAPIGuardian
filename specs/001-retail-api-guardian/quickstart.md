# Quickstart: RetailAPIGuardian

**Feature**: 001-retail-api-guardian
**Date**: 2026-02-19

## Prerequisites

1. **Node.js 18+** installed (`node --version`)
2. **GitHub Copilot CLI** installed and authenticated:
   ```bash
   copilot --version
   copilot auth login
   ```
3. **Git** installed

## Setup (< 2 minutes)

```bash
# Clone the repository
git clone <repo-url>
cd ghcsdk-challenge

# Install dependencies
npm install

# Verify TypeScript compiles
npm run typecheck
```

## Run the Agent

```bash
npm start
# Or directly:
npx tsx src/agent/index.ts
```

You'll see:
```
╔══════════════════════════════════════════════════════════╗
║          🛡️  RetailAPIGuardian Agent                     ║
║   Omnichannel Retail API Integration Management         ║
╚══════════════════════════════════════════════════════════╝

Available commands:
  • 'health'   — Check all vendor API integration health
  • 'changes'  — Scan for upcoming API changes
  • 'fix'      — Analyze & generate code fixes for changes
  • 'test'     — Run integration tests
  • 'deploy'   — Deploy validated changes
  • Or ask anything about your retail integrations!
  • 'exit'     — Quit
```

## Quick Demo Walkthrough

### 1. Check Health (User Story 1)
```
You: health
🛡️ Guardian: [Reports health of Stripe (healthy), Shippo (degraded), LoyaltyAPI (healthy)]
```

### 2. Detect Changes (User Story 2)
```
You: changes
🛡️ Guardian: [Lists 4 API changes sorted by severity: critical OAuth2 migration, high Stripe breaking change, etc.]
```

### 3. Generate Fix (User Story 3)
```
You: fix
🛡️ Guardian: [Generates updated Stripe adapter code replacing 'source' with 'payment_method', shows diff and test suggestions]
```

### 4. Run Tests (User Story 4)
```
You: test
🛡️ Guardian: [Runs Stripe unit tests (12 pass, 0 fail) and Shippo tests (7 pass, 1 fail with details)]
```

### 5. Deploy (User Story 5)
```
You: deploy
🛡️ Guardian: [Deploys to staging via canary strategy, reports deployment ID and rollback point]
```

## Validation Checklist

- [ ] Agent starts without errors
- [ ] Health check returns status for all 3 vendors
- [ ] Change detection reports severity-sorted API changes
- [ ] Code generator produces valid TypeScript with retry logic
- [ ] Test runner reports pass/fail counts with details
- [ ] Deployer creates deployment with rollback point
- [ ] Streaming responses appear word-by-word (not all at once)
