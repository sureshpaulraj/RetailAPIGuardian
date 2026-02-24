# Implementation Plan: Azure Deployment Infrastructure

**Branch**: `MRDeployment` | **Date**: 2026-02-23 | **Spec**: /specs/001-retail-api-guardian/spec.md
**Input**: Feature specification from `/specs/001-retail-api-guardian/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Deploy RetailAPIGuardian to Azure using App Service (Web App) with VNET integration, Key Vault for secrets, PostgreSQL and Redis in private subnets, and Application Gateway as the public entry point. Infrastructure will be defined in Bicep under a new `infra/` folder and wired to existing TypeScript services and Copilot SDK agent.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9 (Node.js 18+)  
**Primary Dependencies**: `@github/copilot-sdk`, `express`, Azure SDKs, `tsx`, `typescript`, `@playwright/test`  
**Storage**: Azure Cosmos DB (existing), Azure Database for PostgreSQL (new), Azure Cache for Redis (new)  
**Testing**: Playwright (`npx playwright test`), `tsc --noEmit` typecheck  
**Target Platform**: Azure App Service (Linux) with VNET integration; Application Gateway for ingress  
**Project Type**: single (monorepo-style app)  
**Performance Goals**: health checks <10s; change analysis <30s; zero-downtime deploys  
**Constraints**: PCI DSS, Key Vault-only secrets, private networking for data stores, API Management gateway requirement  
**Scale/Scope**: 10-50 vendor integrations; single app + supporting Azure services

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Copilot SDK-First**: Pass. Runtime remains `@github/copilot-sdk`.
- **Enterprise Integration Patterns**: Pass. No adapter changes; APIM remains the gateway.
- **Production Stability**: Pass. Plan includes zero-downtime deployments and rollback.
- **Test-Driven Validation**: Pass. Existing Playwright suites remain required before deploy.
- **Azure-Native Observability**: Pass. App Insights/Monitor assumed in deployment wiring.
- **Security & Compliance**: Pass. Key Vault and private networking enforced.
- **Responsible AI**: Pass. Changes are infra-only; human approval preserved.

**Post-Design Re-check**: Pass. No new violations introduced by the design artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── agent/
│   ├── index.ts
│   ├── tools/
│   └── prompts/
├── azure/
├── fabriciq/
├── integrations/
├── monitor/
├── workiq/
└── server.ts

tests/
├── api.spec.ts
├── dashboard.spec.ts
└── fixtures.ts

infra/
└── [bicep templates + parameters]
```

**Structure Decision**: Single project with a new `infra/` folder for Bicep deployment templates.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
