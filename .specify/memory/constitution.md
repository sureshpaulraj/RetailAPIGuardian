<!--
  Sync Impact Report
  Version change: 0.0.0 → 1.0.0
  Modified principles: N/A (initial constitution)
  Added sections: Core Principles (I–VII), Challenge Compliance, Development Workflow, Governance
  Removed sections: None
  Templates requiring updates:
    ✅ .specify/templates/plan-template.md — Constitution Check aligned
    ✅ .specify/templates/spec-template.md — Scope/requirements aligned
    ✅ .specify/templates/tasks-template.md — Task categories aligned
  Follow-up TODOs: None
-->

# RetailAPIGuardian Constitution

## Core Principles

### I. Copilot SDK-First

All agentic capabilities MUST be built using the GitHub Copilot SDK (`@github/copilot-sdk`). The SDK's agentic runtime handles planning, tool invocation, and orchestration. Custom tools MUST be defined via `defineTool()` and registered with the SDK session. No alternative agent frameworks permitted as the primary runtime — this is a GHCSDK Enterprise Challenge submission.

### II. Enterprise Integration Patterns

Every vendor adapter MUST implement: retry with exponential backoff, circuit breaker pattern, structured error handling with typed error codes, and comprehensive request/response logging. All integrations MUST route through a central gateway (Azure API Management). Direct vendor API calls from application code without the adapter layer are prohibited.

### III. Production Stability Above All

No code change MUST be deployed to production without passing automated tests against vendor sandbox environments. All deployments MUST use zero-downtime strategies (canary, blue-green, or rolling). Every deployment MUST create a rollback point. The agent MUST recommend but never auto-deploy to production without human approval.

### IV. Test-Driven Validation

Integration tests MUST exist for every vendor adapter covering: happy path, error handling, retry behavior, and response schema validation. Tests MUST run against vendor sandbox environments. Contract tests MUST validate OpenAPI spec compliance. Test failures MUST block deployment.

### V. Azure-Native Observability

All runtime telemetry MUST flow through Azure Monitor / Application Insights. Structured logging MUST include: vendor name, operation, latency, status code, correlation ID. Health check endpoints MUST be exposed for every vendor integration. Alerting rules MUST trigger on error rate thresholds (>1% warning, >5% critical).

### VI. Security & Compliance

PCI DSS compliance MUST be enforced for all payment-related integrations — no card data in logs, no secrets in code. All vendor API keys MUST be stored in Azure Key Vault. OAuth2 MUST be used where vendors support it. All vendor communications MUST use TLS 1.2+. GDPR/CCPA-relevant data handling MUST be documented in RAI notes.

### VII. Responsible AI

The agent MUST explain every recommendation with rationale and risk level (Low/Medium/High/Critical). Generated code MUST be presented for human review before merge. The agent MUST NOT process customer PII. All agent actions MUST be logged with full audit trail. Limitations of AI-generated code MUST be documented.

## Challenge Compliance

This project MUST satisfy the GHCSDK Enterprise Challenge (Q3 FY26) submission requirements:

- Repository MUST include: `/src` (working code), `/docs` (README with problem→solution, prereqs, setup, deployment, architecture diagram, RAI notes), `AGENTS.md` (custom instructions), `mcp.json` (MCP server config), `/presentations/RetailAPIGuardian.pptx` (demo deck)
- Optional: `/customer` folder with signed testimonial release
- Judging criteria alignment:
  - Enterprise applicability, reusability & business value (30 pts) — universal retail pain point
  - Integration with Azure/Microsoft solutions (25 pts) — API Management, Functions, Event Grid, Monitor, Cosmos DB
  - Operational readiness: deployability, observability, CI/CD (15 pts) — GitHub Actions pipeline
  - Security, governance & Responsible AI excellence (15 pts) — PCI DSS, Key Vault, RAI notes
  - Storytelling, clarity & amplification-ready quality (15 pts)
- Bonus targets: Work IQ integration (15 pts), customer validation (10 pts), SDK product feedback (10 pts)

## Development Workflow

1. **Spec-Driven Development**: All features flow through speckit phases: constitution → specify → plan → tasks → implement
2. **Branch-per-feature**: Each feature gets a numbered branch via speckit's `create-new-feature.ps1`
3. **TypeScript strict mode**: All source code MUST compile under `strict: true` with zero errors
4. **CI gates**: Every PR MUST pass: type-check (`tsc --noEmit`), lint, unit tests, integration tests
5. **Code review**: Generated adapter code MUST be reviewed before merge — the agent assists, humans are accountable
6. **Commit convention**: Conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`)

## Governance

This constitution supersedes all other development practices for the RetailAPIGuardian project. Amendments require:

1. Documentation of the change and rationale
2. Version bump per semantic versioning (MAJOR for principle removal/redefinition, MINOR for new principles, PATCH for clarifications)
3. Consistency propagation across all speckit templates and dependent artifacts
4. Review and approval before merge

All PRs and code reviews MUST verify compliance with these principles. Complexity beyond these guidelines MUST be justified in writing. Use `AGENTS.md` for runtime agent guidance.

**Version**: 1.0.0 | **Ratified**: 2026-02-19 | **Last Amended**: 2026-02-19
