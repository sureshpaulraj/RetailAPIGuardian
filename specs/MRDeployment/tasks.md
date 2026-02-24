# Tasks: Azure Deployment Infrastructure (RetailAPIGuardian)

**Input**: Design documents from `specs/MRDeployment/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Create infra structure and baseline Bicep configuration

- [X] T001 Create `infra/` folder with `infra/main.bicep` and `infra/parameters/` structure
- [X] T002 [P] Add `infra/bicepconfig.json` with module aliases and linting rules

---

## Phase 2: Networking

**Purpose**: VNET, subnets, and private DNS foundations

- [X] T003 Implement `infra/modules/network.bicep` for VNET, subnets (app-gw, appsvc-integration, private-endpoints), and NSGs
- [X] T004 [P] Implement `infra/modules/private-dns.bicep` for `privatelink.vaultcore.azure.net`, `privatelink.postgres.database.azure.com`, `privatelink.redis.cache.windows.net`

---

## Phase 3: Security & Secrets

**Purpose**: Key Vault and private access

- [X] T005 Implement `infra/modules/key-vault.bicep` with RBAC enabled, private endpoint, and private DNS zone group wiring

---

## Phase 4: Data Stores

**Purpose**: PostgreSQL and Redis within the VNET

- [X] T006 Implement `infra/modules/postgres.bicep` for PostgreSQL Flexible Server with private endpoint and public access disabled
- [X] T007 Implement `infra/modules/redis.bicep` for Azure Cache for Redis with private endpoint and public access disabled

---

## Phase 5: App Service & Observability

**Purpose**: Web App hosting with managed identity and VNET integration

- [X] T008 Implement `infra/modules/app-service.bicep` for App Service plan + Web App (Linux), managed identity, and VNET integration
- [X] T009 [P] Implement `infra/modules/monitoring.bicep` for Log Analytics + Application Insights (workspace-based)

---

## Phase 6: Ingress

**Purpose**: Application Gateway with WAF v2 fronting the Web App

- [X] T010 Implement `infra/modules/app-gateway.bicep` with public IP, WAF policy, listener, routing rule, probe, and backend pool for Web App private endpoint

---

## Phase 7: Composition & Parameters

**Purpose**: Wire modules together and provide environment configuration

- [X] T011 Update `infra/main.bicep` to compose all modules with dependencies and outputs
- [X] T012 Create parameter files in `infra/parameters/` (dev, staging, prod) with SKU and sizing overrides

---

## Phase 8: Validation & Documentation

**Purpose**: Ensure deployment correctness and operator clarity

- [X] T013 Run `az bicep build` validation on `infra/main.bicep`
- [X] T014 [P] Add deployment instructions in `infra/README.md` with `az deployment group create` examples

---

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2
- Phase 2 before Phases 3–6
- Phase 7 depends on Phases 3–6
- Phase 8 after Phase 7
