# Tasks: Connector Health Dashboard (React)

**Input**: Design documents from `/specs/001-mr-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: OpenAPI contract tests are required for connector status endpoints.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create React app scaffold in frontend/ with Vite + React + TypeScript
- [x] T002 [P] Add frontend build and dev scripts to package.json (dashboard:ui, dashboard:build)
- [x] T003 [P] Create base frontend layout, routing shell, and global styles in frontend/src/app/ and frontend/src/styles/
- [x] T004 [P] Add Vite proxy to backend API in frontend/vite.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T005 Create shared connector types in src/fabriciq/connector-types.ts
- [ ] T006 [P] Add Cosmos DB repository for connector history and analysis in src/azure/connector-repo.ts
- [ ] T046 [P] Configure 18-month TTL for connector history and analysis items in src/azure/connector-repo.ts
- [ ] T007 [P] Create connector service to orchestrate agent tools and persistence in src/fabriciq/connector-service.ts
- [ ] T008 Add dashboard API router for connector endpoints in src/fabriciq/connector-routes.ts
- [ ] T009 Wire connector routes into src/server.ts under /api/connectors
- [ ] T010 Add frontend API client wrapper in frontend/src/services/api-client.ts
- [ ] T042 Add structured logging middleware with correlation IDs in src/server.ts
- [ ] T043 Add connector endpoint logging (vendor, operation, latency, status) in src/fabriciq/connector-routes.ts
- [ ] T044 Add App Insights export wiring for connector logs in src/azure/monitor.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel (requires T042-T044 observability tasks completed)

---

## Phase 3: User Story 1 - View Connector Health (Priority: P1) 🎯 MVP

**Goal**: Show all connectors with name, last checked time, and health status; include viewable history.

**Independent Test**: Open the dashboard and verify the list and history view show connector name, last checked time, and good/slow/broken status for all connectors.

### Implementation for User Story 1

### Tests for User Story 1

- [ ] T011 [P] [US1] Add OpenAPI contract test for GET /api/connectors in tests/contract/connectors.contract.spec.ts
- [ ] T012 [P] [US1] Add OpenAPI contract test for GET /api/connectors/{connectorId}/history in tests/contract/connectors.contract.spec.ts

### Implementation for User Story 1

- [ ] T013 [US1] Implement GET /api/connectors in src/fabriciq/connector-routes.ts using connector service
- [ ] T014 [US1] Map agent health results to good/slow/broken and persist latest status in src/fabriciq/connector-service.ts
- [ ] T015 [US1] Implement GET /api/connectors/{connectorId}/history in src/fabriciq/connector-routes.ts
- [ ] T016 [P] [US1] Build connector list page in frontend/src/pages/ConnectorList.tsx
- [ ] T017 [P] [US1] Create status badge, empty state, and last-checked components in frontend/src/components/
- [ ] T018 [US1] Add history drawer/panel in frontend/src/components/ConnectorHistory.tsx
- [ ] T019 [US1] Wire list + history data fetching in frontend/src/services/connectors.ts

**Checkpoint**: User Story 1 fully functional and independently testable

---

## Phase 4: User Story 2 - Recheck Connector Health (Priority: P2)

**Goal**: Allow users to recheck all or selected connectors and see progress/completion.

**Independent Test**: Select connectors or choose "all," trigger recheck, and confirm request status and updated last checked times.

### Implementation for User Story 2

### Tests for User Story 2

- [ ] T020 [P] [US2] Add OpenAPI contract test for POST /api/connectors/recheck in tests/contract/recheck.contract.spec.ts
- [ ] T021 [P] [US2] Add OpenAPI contract test for GET /api/connectors/recheck/{requestId} in tests/contract/recheck.contract.spec.ts

### Implementation for User Story 2

- [ ] T022 [US2] Implement POST /api/connectors/recheck in src/fabriciq/connector-routes.ts
- [ ] T023 [US2] Implement GET /api/connectors/recheck/{requestId} in src/fabriciq/connector-routes.ts
- [ ] T024 [US2] Add recheck request handling and status tracking in src/fabriciq/connector-service.ts
- [ ] T025 [P] [US2] Add connector selection UI and recheck controls in frontend/src/components/RecheckControls.tsx
- [ ] T026 [US2] Wire recheck actions and polling in frontend/src/services/connectors.ts
- [ ] T027 [US2] Display recheck progress and completion status in frontend/src/pages/ConnectorList.tsx

**Checkpoint**: User Stories 1 and 2 work independently

---

## Phase 5: User Story 3 - Investigate Broken Connector (Priority: P3)

**Goal**: Request change analysis for broken connectors and show recommendations with rationale and risk level.

**Independent Test**: Select a broken connector, request analysis, and verify the UI shows summary, recommendations, and risk level or a clear error state.

### Implementation for User Story 3

### Tests for User Story 3

- [ ] T028 [P] [US3] Add OpenAPI contract test for POST /api/connectors/{connectorId}/analysis in tests/contract/analysis.contract.spec.ts
- [ ] T029 [P] [US3] Add OpenAPI contract test for GET /api/connectors/{connectorId}/analysis in tests/contract/analysis.contract.spec.ts

### Implementation for User Story 3

- [ ] T030 [US3] Implement POST /api/connectors/{connectorId}/analysis in src/fabriciq/connector-routes.ts
- [ ] T031 [US3] Implement GET /api/connectors/{connectorId}/analysis in src/fabriciq/connector-routes.ts
- [ ] T032 [US3] Add change analysis orchestration using monitor/generate tools in src/fabriciq/connector-service.ts
- [ ] T033 [P] [US3] Build analysis panel UI in frontend/src/components/ConnectorAnalysis.tsx
- [ ] T034 [US3] Wire analysis requests and display logic in frontend/src/services/connectors.ts
- [ ] T035 [US3] Add error and unavailable-state messaging for analysis in frontend/src/pages/ConnectorList.tsx

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Serve React build from Express in src/server.ts and update static asset path
- [ ] T037 [P] Update docs/README.md with dashboard run and build steps
- [ ] T038 [P] Update specs/001-mr-dashboard/quickstart.md validation notes with final commands
- [ ] T039 [P] Add dashboard navigation link in frontend/src/app/App.tsx
- [ ] T040 [P] Add contract test runner script to package.json and document it in tests/contract/README.md
- [ ] T041 [P] Wire OpenAPI contract tests into CI workflow and enforce CI gate in .github/workflows/ci.yml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- T002, T003, T004 can run in parallel after T001
- T006 and T007 can run in parallel after T005
- Frontend component tasks T016 and T017 can run in parallel
- US2 UI task T025 can run in parallel with backend tasks T022-T024
- US3 UI task T033 can run in parallel with backend tasks T030-T032

---

## Parallel Example: User Story 1

```bash
Task: "Build connector list page in frontend/src/pages/ConnectorList.tsx"
Task: "Create status badge, empty state, and last-checked components in frontend/src/components/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational
2. User Story 1 → validate
3. User Story 2 → validate
4. User Story 3 → validate
5. Polish
