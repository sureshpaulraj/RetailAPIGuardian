# Research — Connector Health Dashboard (React)

## Decisions

### UI Framework and Build Tool
- **Decision**: Build the dashboard as a React SPA using Vite for development and production builds.
- **Rationale**: React is already common in the repo ecosystem, and Vite provides fast dev feedback with minimal configuration.
- **Alternatives considered**: Server-rendered HTML in Express (rejected to meet the requirement for a React app), Next.js (rejected to avoid introducing a full SSR framework).

### API and Agent Integration
- **Decision**: Keep the existing Express server as the backend API and add endpoints that invoke the Copilot SDK tools (`check_api_health`, `monitor_api_changes`, `generate_adapter_code`) for health rechecks and breakage analysis.
- **Rationale**: Reuses existing agent tooling while keeping the web UI thin and focused on presentation.
- **Alternatives considered**: Separate backend service or a CLI-only interface (rejected due to new dashboard requirements).

### Health History Storage
- **Decision**: Persist connector health history and analysis results in Azure Cosmos DB (already part of the repo) with an in-memory fallback for local development.
- **Rationale**: Meets the requirement for a viewable history and aligns with the existing Azure data layer.
- **Alternatives considered**: File-based storage (rejected for lack of concurrency and operational safety).

### Deployment Shape
- **Decision**: Serve the React build output as static assets from the existing Express server and deploy as a single web app.
- **Rationale**: Simplifies Azure App Service deployment while keeping a unified API surface.
- **Alternatives considered**: Separate static hosting on Azure Storage + CDN (rejected to keep deployment scope small for this feature).
