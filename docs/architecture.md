# Architecture — RetailAPIGuardian

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RetailAPIGuardian                               │
│                                                                         │
│  ┌───────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │  API Monitor   │──▶│  Copilot SDK Agent   │──▶│  Code Generator    │  │
│  │ (Azure Func)   │   │  (Agentic Core)      │   │  (Custom Tools)    │  │
│  │                 │   │                      │   │                    │  │
│  │ • Changelog     │   │ • Planning           │   │ • Adapter updates  │  │
│  │   polling       │   │ • Tool orchestration │   │ • Test generation  │  │
│  │ • OpenAPI diff  │   │ • Impact analysis    │   │ • PR creation      │  │
│  │ • Webhook recv  │   │ • Decision making    │   │                    │  │
│  └───────────────┘   └─────────────────────┘   └────────────────────┘  │
│         │                      │                         │              │
│         ▼                      ▼                         ▼              │
│  ┌───────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │ Azure Event    │   │ Azure API Mgmt      │   │ GitHub Actions     │  │
│  │ Grid           │   │ (Gateway/Proxy)     │   │ (CI/CD Pipeline)   │  │
│  │                │   │                      │   │                    │  │
│  │ • Change       │   │ • Rate limiting      │   │ • Build & test     │  │
│  │   routing      │   │ • Auth proxy         │   │ • Canary deploy    │  │
│  │ • Fan-out      │   │ • Request logging    │   │ • Rollback on fail │  │
│  └───────────────┘   └─────────────────────┘   └────────────────────┘  │
│         │                      │                         │              │
│         ▼                      ▼                         ▼              │
│  ┌───────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │ Azure Monitor  │   │ Work IQ / Fabric IQ │   │ Azure Cosmos DB    │  │
│  │ (Telemetry)    │   │ (Notifications)     │   │ (State Store)      │  │
│  │                │   │                      │   │                    │  │
│  │ • Latency      │   │ • Teams alerts       │   │ • Change history   │  │
│  │ • Error rates  │   │ • Email digests      │   │ • Adapter versions │  │
│  │ • Dashboards   │   │ • Analytics          │   │ • Test results     │  │
│  └───────────────┘   └─────────────────────┘   └────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. API Monitor (Azure Functions)
- **Timer-triggered** functions poll vendor changelogs every 15 minutes
- **HTTP-triggered** functions receive vendor webhook notifications
- Compares current OpenAPI specs against stored baseline
- Publishes change events to Azure Event Grid

### 2. Copilot SDK Agent (Core)
- Built with `@github/copilot-sdk` TypeScript SDK
- Uses **custom tools** for each stage of the integration lifecycle
- System prompt provides retail domain context and enterprise standards
- Supports interactive CLI mode and automated (headless) mode

### 3. Custom Tools
| Tool | Purpose |
|------|---------|
| `check_api_health` | Real-time health check across all vendor integrations |
| `monitor_api_changes` | Detect breaking changes, deprecations, and new features |
| `generate_adapter_code` | Produce updated TypeScript adapter code |
| `run_integration_tests` | Execute tests against vendor sandboxes |
| `deploy_changes` | Orchestrate zero-downtime deployments |

### 4. Azure Integration Layer
- **API Management**: Central gateway for all vendor API calls with rate limiting, auth proxy, and request/response logging
- **Event Grid**: Routes API change events to appropriate handlers
- **Cosmos DB**: Stores integration state (change history, adapter versions, test results)
- **Monitor**: Application Insights for telemetry, alerting, and dashboards

### 5. Notification & Analytics
- **Work IQ**: Sends alerts to Teams/Email when critical changes detected or deployments complete
- **Fabric IQ**: Analytics dashboard showing integration health trends, change frequency, and reliability metrics

## Data Flow

```
Vendor API Change → Azure Functions → Event Grid → Copilot Agent
     → Impact Analysis → Code Generation → Testing → Deployment
     → Work IQ Notification → Azure Monitor Telemetry
```

## Security Architecture

- All vendor API keys stored in **Azure Key Vault**
- Copilot SDK uses **GitHub OAuth** for authentication
- Azure API Management enforces **mTLS** for vendor connections
- **PCI DSS** compliance for payment adapter handling
- Cosmos DB encrypted at rest with **customer-managed keys**
