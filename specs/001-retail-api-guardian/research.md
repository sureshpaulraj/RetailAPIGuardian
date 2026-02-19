# Research: RetailAPIGuardian

**Feature**: 001-retail-api-guardian
**Date**: 2026-02-19

## Research Topics & Decisions

### 1. GitHub Copilot SDK Agent Runtime

**Decision**: Use `@github/copilot-sdk` TypeScript SDK with `defineTool()` for all custom tools
**Rationale**: Challenge requirement mandates Copilot SDK. The SDK provides production-tested agent runtime with planning, tool orchestration, streaming, and multi-model support out of the box.
**Alternatives considered**: LangChain, Semantic Kernel — rejected because challenge requires Copilot SDK as primary runtime.

### 2. Vendor API Change Detection Approach

**Decision**: Simulated changelog data for demo; production design uses Azure Functions timer-triggered polling of vendor changelog feeds + OpenAPI spec diffing
**Rationale**: Vendor changelogs (Stripe, Shippo) are publicly available as RSS/JSON feeds. OpenAPI specs can be diffed programmatically. For the challenge demo, simulated data demonstrates the pattern without requiring live vendor feeds.
**Alternatives considered**: Webhook-only approach — rejected because not all vendors support proactive webhooks for API changes.

### 3. Code Generation Strategy

**Decision**: Template-based generation with Copilot SDK agent context for complex cases
**Rationale**: For common patterns (parameter rename, endpoint migration, auth change), template-based generation is fast and predictable. For complex multi-file changes, the Copilot SDK agent can analyze the codebase and generate contextual updates.
**Alternatives considered**: Pure LLM generation — rejected because it's less predictable for enterprise-critical payment code.

### 4. Deployment Orchestration

**Decision**: GitHub Actions as the deployment engine with canary/blue-green/rolling strategies
**Rationale**: Challenge submissions must include CI/CD. GitHub Actions is native to the GitHub ecosystem and integrates with Azure deployment targets.
**Alternatives considered**: Azure DevOps Pipelines — rejected because challenge emphasizes GitHub ecosystem integration.

### 5. State Management

**Decision**: Azure Cosmos DB for change history, adapter versions, test results, deployment audit trail
**Rationale**: Cosmos DB provides global distribution, automatic indexing, and schema flexibility — good fit for heterogeneous integration state data. Aligns with Azure integration points for challenge scoring.
**Alternatives considered**: Azure Table Storage (simpler but less queryable), PostgreSQL (overkill for this use case).

### 6. Authentication & Security

**Decision**: GitHub OAuth for Copilot SDK auth; Azure Key Vault for vendor API keys; OAuth2 for vendors that support it
**Rationale**: Copilot SDK natively supports GitHub OAuth. Key Vault is the Azure-standard secret store. Constitution principle VI mandates PCI DSS compliance and TLS 1.2+.
**Alternatives considered**: Environment variables for secrets — rejected per security principle VI.

### 7. Observability Stack

**Decision**: Azure Monitor / Application Insights for all telemetry; structured JSON logging with correlation IDs
**Rationale**: Constitution principle V mandates Azure-native observability. Application Insights provides built-in dashboards, alerting, and distributed tracing.
**Alternatives considered**: Datadog, Grafana — rejected because challenge scores Azure integration.
