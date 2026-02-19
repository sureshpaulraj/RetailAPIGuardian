# RetailAPIGuardian — Documentation

## Problem Statement

Retailers integrate with **dozens of third-party vendor APIs** across their technology stack:
- **Payment processors**: Stripe, Adyen, Square, PayPal
- **Shipping carriers**: Shippo, EasyPost, ShipStation
- **Loyalty platforms**: Custom APIs, Yotpo, Smile.io
- **POS systems**: Shopify, Square, Lightspeed
- **Marketing tools**: Klaviyo, Braze, Mailchimp

Each vendor operates on its own release cadence, introducing **breaking changes, deprecations, and security updates** at unpredictable intervals. Maintaining these integrations is a massive engineering burden:

- **75% of retail outages** during peak sales events trace back to third-party API integration failures
- Average retailer spends **2,000+ engineering hours/year** maintaining vendor integrations
- A single payment integration failure during Black Friday costs **$1M+/hour** in lost revenue

## Solution: RetailAPIGuardian

An **agentic AI platform** powered by the GitHub Copilot SDK that automates the entire integration lifecycle:

1. **🔍 Monitor** — Continuously watches vendor API changelogs, OpenAPI specs, and webhook feeds
2. **📊 Analyze** — Assesses impact of detected changes on existing adapter code
3. **🔧 Generate** — Produces updated TypeScript adapter code with enterprise patterns
4. **🧪 Test** — Validates generated code against vendor sandbox environments
5. **🚀 Deploy** — Orchestrates zero-downtime deployments via GitHub Actions
6. **📢 Alert** — Notifies teams via Work IQ (Teams/Email) about integration health

## Prerequisites

- **Node.js** 18+
- **GitHub Copilot CLI** installed and authenticated
- **Azure subscription** (for Functions, Event Grid, API Management, Monitor, Cosmos DB)
- **Vendor sandbox accounts** (Stripe test keys, Shippo sandbox, etc.)

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd ghcsdk-challenge

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys and Azure credentials

# 4. Authenticate Copilot CLI
copilot auth login

# 5. Run the agent
npx tsx src/agent/index.ts
```

## Deployment

### Azure Resources Setup

```bash
# Create resource group
az group create --name rg-retail-api-guardian --location eastus

# Deploy Azure Functions (API monitoring)
az functionapp create --name retail-api-monitor \
  --resource-group rg-retail-api-guardian \
  --consumption-plan-location eastus \
  --runtime node --runtime-version 18

# Deploy Azure API Management
az apim create --name retail-api-gateway \
  --resource-group rg-retail-api-guardian \
  --publisher-name "RetailAPIGuardian" \
  --publisher-email admin@example.com

# Deploy Cosmos DB (state management)
az cosmosdb create --name retail-api-state \
  --resource-group rg-retail-api-guardian
```

### CI/CD via GitHub Actions

The included `.github/workflows/ci.yml` handles:
- Linting & type checking on every PR
- Unit + integration tests on every push
- Deployment to staging on merge to `main`
- Production deployment with manual approval

## Architecture

See [architecture.md](./architecture.md) for detailed system design.

## Responsible AI

See [rai-notes.md](./rai-notes.md) for RAI considerations.
