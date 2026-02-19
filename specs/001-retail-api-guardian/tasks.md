# Tasks: RetailAPIGuardian — Omnichannel Retail API Integration Agent

**Input**: Design documents from `specs/001-retail-api-guardian/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan (`src/agent/tools/`, `src/agent/prompts/`, `src/integrations/stripe/`, `src/integrations/shippo/`, `src/integrations/loyalty-api/`, `src/monitor/`, `docs/`, `presentations/`, `customer/`, `.github/workflows/`)
- [X] T002 Initialize TypeScript project with `@github/copilot-sdk`, `express`, `tsx`, `typescript` dependencies in `package.json`
- [X] T003 [P] Configure `tsconfig.json` with strict mode, ES2022 target, NodeNext module resolution
- [X] T004 [P] Create `.gitignore` with Node.js patterns (node_modules, dist, .env, *.log)
- [X] T005 [P] Create `AGENTS.md` with RetailAPIGuardian custom instructions per constitution and challenge requirements
- [X] T006 [P] Create `mcp.json` with GitHub MCP server configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create system prompt in `src/agent/prompts/system.ts` with retail integration context, enterprise standards, risk levels, and RAI guidelines per constitution principles I–VII
- [X] T008 Create main agent entry point in `src/agent/index.ts` that initializes CopilotClient, creates session with streaming, registers all tools, and provides interactive CLI with shortcut commands (health, changes, fix, test, deploy)
- [X] T009 [P] Create CI/CD pipeline in `.github/workflows/ci.yml` with lint, typecheck, test, deploy-staging, deploy-production jobs
- [X] T010 [P] Create root `README.md` with project overview, quick start, links to docs
- [X] T011 [P] Create `docs/README.md` with problem→solution narrative, prerequisites, setup instructions, deployment guide
- [X] T012 [P] Create `docs/architecture.md` with system architecture diagram showing all Azure components and data flow
- [X] T013 [P] Create `docs/rai-notes.md` with Responsible AI considerations: human-in-the-loop, transparency, security, reliability, fairness, accountability

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Check Vendor Integration Health (Priority: P1) 🎯 MVP

**Goal**: Agent responds to "health" command with structured vendor health status for all configured integrations

**Independent Test**: Run agent, type "health", verify it returns Stripe (healthy), Shippo (degraded), LoyaltyAPI (healthy) with latency, error rate, timestamp

### Implementation for User Story 1

- [X] T014 [US1] Implement `check_api_health` tool in `src/agent/tools/health-checker.ts` using `defineTool()` with parameters (optional vendor name), return type (VendorHealthStatus[]), and simulated health data for Stripe, Shippo, LoyaltyAPI
- [X] T015 [US1] Register `checkApiHealth` tool in `src/agent/index.ts` session tools array
- [X] T016 [US1] Verify agent responds to "health" with structured health summary including status, latency, error rate per vendor
- [X] T017 [US1] Verify agent handles single-vendor health check (e.g., "check stripe health")

**Checkpoint**: User Story 1 fully functional — agent reports vendor integration health via single command

---

## Phase 4: User Story 2 — Detect and Analyze API Breaking Changes (Priority: P2)

**Goal**: Agent responds to "changes" command with severity-sorted list of detected API changes across all vendors

**Independent Test**: Run agent, type "changes", verify it returns changes sorted by severity (critical first) with vendor, type, affected endpoints, deadline

### Implementation for User Story 2

- [X] T018 [US2] Implement `monitor_api_changes` tool in `src/agent/tools/api-monitor.ts` using `defineTool()` with parameters (optional vendor, optional severity filter), return type (ApiChange[]), and simulated change data: Stripe breaking change (source→payment_method), Shippo deprecation (v1→v2 rates), LoyaltyAPI security (OAuth2 migration), Stripe new feature
- [X] T019 [US2] Register `monitorApiChanges` tool in `src/agent/index.ts` session tools array
- [X] T020 [US2] Verify agent responds to "changes" with severity-sorted change list
- [X] T021 [US2] Verify agent handles vendor-filtered changes (e.g., "show stripe changes")

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 — Generate Updated Adapter Code (Priority: P3)

**Goal**: Agent generates updated TypeScript adapter code for detected API changes with enterprise patterns

**Independent Test**: Ask agent to fix Stripe payment_method migration, verify output includes updated code with retry logic, types, and changes summary

### Implementation for User Story 3

- [X] T022 [P] [US3] Create Stripe payment adapter in `src/integrations/stripe/adapter.ts` with PaymentRequest/PaymentResult types, createPayment function using payment_method, retry with exponential backoff
- [X] T023 [P] [US3] Create Shippo shipping adapter in `src/integrations/shippo/adapter.ts` with ShippingRateRequest/ShippingRate types, getRates function using v2 endpoint
- [X] T024 [P] [US3] Create LoyaltyAPI adapter in `src/integrations/loyalty-api/adapter.ts` with LoyaltyMember/RewardRedemption types, OAuth2 token management, getMember and redeemReward functions
- [X] T025 [US3] Implement `generate_adapter_code` tool in `src/agent/tools/code-generator.ts` using `defineTool()` with parameters (vendor, changeDescription, currentAdapterPath), return type (GeneratedCode with code, changesSummary, testSuggestions), and template-based generation for Stripe and Shippo
- [X] T026 [US3] Register `generateAdapterCode` tool in `src/agent/index.ts` session tools array
- [X] T027 [US3] Verify agent generates valid TypeScript adapter code when asked to "fix" detected changes

**Checkpoint**: User Stories 1, 2, AND 3 all work independently

---

## Phase 6: User Story 4 — Run Integration Tests (Priority: P4)

**Goal**: Agent runs integration tests against vendor sandboxes and reports detailed pass/fail results

**Independent Test**: Ask agent to run Stripe unit tests, verify it returns 12 passed, 0 failed, 1 skipped with durations

### Implementation for User Story 4

- [X] T028 [US4] Implement `run_integration_tests` tool in `src/agent/tools/test-runner.ts` using `defineTool()` with parameters (vendor, testType, optional adapterPath), return type (TestResult with passed/failed/skipped counts, test case details), and simulated results for stripe-unit (12 pass), stripe-integration (5 pass), shippo-unit (7 pass, 1 fail)
- [X] T029 [US4] Register `runIntegrationTests` tool in `src/agent/index.ts` session tools array
- [X] T030 [US4] Verify agent reports test results with pass/fail counts, durations, and error details for failed tests

**Checkpoint**: User Stories 1–4 all work independently

---

## Phase 7: User Story 5 — Deploy Validated Changes (Priority: P5)

**Goal**: Agent orchestrates zero-downtime deployments with rollback, requiring human approval for production

**Independent Test**: Ask agent to deploy to staging with canary strategy, verify deployment plan with steps, status, rollback ID

### Implementation for User Story 5

- [X] T031 [US5] Implement `deploy_changes` tool in `src/agent/tools/deployer.ts` using `defineTool()` with parameters (vendor, branch, environment, strategy), return type (DeployResult with steps, status, deploymentId, rollbackId), production requiring approval, staging succeeding automatically
- [X] T032 [US5] Register `deployChanges` tool in `src/agent/index.ts` session tools array
- [X] T033 [US5] Verify agent returns "pending-approval" for production non-canary deployments
- [X] T034 [US5] Verify agent returns "success" for staging deployments with step-by-step status

**Checkpoint**: All 5 user stories are independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and challenge submission completeness

- [X] T035 [P] Create API change monitoring scaffold in `src/monitor/changelog-watcher.ts` with Azure Functions timer-trigger pattern
- [X] T036 [P] Update `docs/README.md` with complete deployment instructions for Azure (Functions, API Management, Cosmos DB, Monitor)
- [X] T037 [P] Verify `AGENTS.md` covers all 5 tools and retail domain context per challenge requirements
- [X] T038 [P] Verify `mcp.json` has GitHub MCP server configuration
- [X] T039 [P] Verify `.github/workflows/ci.yml` has lint → test → deploy-staging → deploy-production pipeline
- [X] T040 Verify TypeScript strict mode compilation passes (`npx tsc --noEmit`)
- [X] T041 Run quickstart.md validation — execute all 5 demo commands and verify expected outputs
- [X] T042 [P] Create placeholder for presentation deck at `presentations/RetailAPIGuardian.pptx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3 → P4 → P5)
  - US3 adapters (T022–T024) can run in parallel with each other
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Adapters are independent; code generator references adapters but can be tested independently
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) — Independent test data
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) — Independent deployment simulation

### Within Each User Story

- Tool implementation before registration
- Registration before verification
- Core implementation before edge case handling

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005, T006)
- All Foundational tasks marked [P] can run in parallel (T009, T010, T011, T012, T013)
- Within US3: adapter files (T022, T023, T024) can run in parallel
- All Polish tasks marked [P] can run in parallel (T035–T039, T042)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 — health check
4. **STOP and VALIDATE**: Run agent, type "health", verify output
5. Demo-ready with a single valuable feature

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Health monitoring (MVP!)
3. Add User Story 2 → Change detection
4. Add User Story 3 → Code generation
5. Add User Story 4 → Test execution
6. Add User Story 5 → Deployment orchestration
7. Complete Polish → Challenge-ready submission

---

## Summary

- **Total tasks**: 42
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 7 tasks
- **Phase 3 (US1 - Health)**: 4 tasks
- **Phase 4 (US2 - Changes)**: 4 tasks
- **Phase 5 (US3 - Code Gen)**: 6 tasks
- **Phase 6 (US4 - Tests)**: 3 tasks
- **Phase 7 (US5 - Deploy)**: 4 tasks
- **Phase 8 (Polish)**: 8 tasks
- **Parallel opportunities**: 19 tasks marked [P]
- **MVP scope**: Phases 1–3 (17 tasks) deliver a working health-check agent
