# RetailAPIGuardian

> **Omnichannel Retail API Integration Agent** — Never break an integration during Black Friday again.

An agentic AI-powered integration platform built with the **GitHub Copilot SDK** that monitors vendor API changes, auto-generates adapter code, tests against sandboxes, and deploys with zero downtime — keeping retail integrations healthy 24/7.

## 🚀 Quick Start

```bash
# Prerequisites: Node.js 18+, Copilot CLI installed & authenticated
copilot --version

# Install dependencies
npm install

# Run the agent
npx tsx src/agent/index.ts

# Run the dashboard API
npm run dashboard

# Run the dashboard UI (Vite)
npm run dashboard:ui
```

## ☁️ Azure Deployment

This repo includes Bicep templates in [infra/README.md](infra/README.md).

```bash
az login
az account set --subscription <subscription-id>

az group create --name <rg-name> --location <region>

az deployment group create \
	--resource-group <rg-name> \
	--template-file infra/main.bicep \
	--parameters infra/parameters/dev.json
```

Replace the `<REPLACE-WITH-SECRET>` values in parameter files before deploying.

## 📖 Documentation

- [Full Documentation](./docs/README.md) — Problem, solution, prereqs, setup, deployment
- [Architecture](./docs/architecture.md) — System design & diagrams
- [Responsible AI](./docs/rai-notes.md) — RAI considerations & guardrails

## 🏗️ Project Structure

```
src/                          # Application code
├── agent/                    # Copilot SDK agent core
│   ├── index.ts              # Main agent entry point
│   ├── tools/                # Custom agent tools
│   └── prompts/              # System prompts
├── integrations/             # Sample vendor adapters
├── monitor/                  # API change detection
└── server.ts                 # Dashboard server
docs/                         # Documentation
presentations/                # Demo deck
AGENTS.md                     # Custom Copilot instructions
mcp.json                      # MCP server config
```

## 📊 Challenge Submission

Built for the **GHCSDK Enterprise Challenge (Q3 FY26)** — showcasing enterprise-grade retail integration management powered by the GitHub Copilot SDK.

## License

MIT
