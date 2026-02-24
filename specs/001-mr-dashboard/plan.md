# Implementation Plan: Connector Health Dashboard (React)

**Branch**: `001-mr-dashboard` | **Date**: 2026-02-23 | **Spec**: /specs/001-mr-dashboard/spec.md
**Input**: Feature specification from `/specs/001-mr-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Deliver a React dashboard that lists all deployed connectors with health status and last check time, supports rechecking all or selected connectors, and requests breakage analysis with fix recommendations. The backend will extend the existing Express server and use the Copilot SDK tools (`check_api_health`, `monitor_api_changes`, `generate_adapter_code`) to provide real-time health and change analysis data, while persisting check history for operational review.

## Technical Context

**Language/Version**: TypeScript 5.9 (Node.js 18+)  
**Primary Dependencies**: `@github/copilot-sdk`, `express`, `tsx`, `typescript`, React (`react`, `react-dom`), Vite  
**Storage**: Azure Cosmos DB (existing) for connector health history and analysis results  
**Testing**: Playwright (`npx playwright test`), `tsc --noEmit` typecheck  
**Target Platform**: Azure App Service (Linux) hosting Express API + static React assets  
**Project Type**: web (frontend + backend)  
**Performance Goals**: dashboard load <5s p95; recheck request ack <2s; analysis response <30s  
**Constraints**: Copilot SDK-first runtime; APIM gateway; PCI DSS/Key Vault compliance; no PII in analysis  
**Scale/Scope**: 10-100 connectors; 1k+ health checks/day; 30-day history view

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Copilot SDK-First**: Pass. Uses existing `@github/copilot-sdk` tools for health and change analysis.
- **Enterprise Integration Patterns**: Pass. Connector calls remain behind adapters and APIM.
- **Production Stability**: Pass. Recheck and analysis endpoints are non-destructive; deployments require tests and approval.
- **Test-Driven Validation**: Pass. Playwright and typecheck remain gating.
- **Azure-Native Observability**: Pass. API requests will emit Azure Monitor/App Insights telemetry.
- **Security & Compliance**: Pass. No secrets in code; no PII; Key Vault use remains intact.
- **Responsible AI**: Pass. Change analysis responses include rationale and risk level; human review required.

**Post-Design Re-check**: Pass. Design artifacts align with constitution requirements.

## Project Structure

### Documentation (this feature)

```text
specs/001-mr-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── agent/
│   ├── index.ts
│   ├── tools/
│   └── prompts/
├── fabriciq/
├── integrations/
├── monitor/
├── workiq/
└── server.ts

frontend/
├── public/
└── src/
    ├── app/
    ├── components/
    ├── pages/
    ├── services/
    └── styles/

tests/
├── api.spec.ts
├── dashboard.spec.ts
└── fixtures.ts
```

**Structure Decision**: Introduce a `frontend/` React app (Vite) alongside the existing `src/` backend so the dashboard can be deployed as a React SPA while reusing the current Express server and Copilot SDK tools.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
