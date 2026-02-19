# Data Model: RetailAPIGuardian

**Feature**: 001-retail-api-guardian
**Date**: 2026-02-19

## Entities

### VendorIntegration

Represents a configured connection to a third-party vendor API.

| Field | Type | Description |
|-------|------|-------------|
| vendorId | string | Unique identifier (e.g., "stripe", "shippo") |
| displayName | string | Human-readable name (e.g., "Stripe") |
| category | enum | payment, shipping, loyalty, pos, marketing |
| baseUrl | string | Vendor API base URL |
| authMethod | enum | api-key, oauth2, bearer-token |
| adapterPath | string | File path to the TypeScript adapter |
| currentApiVersion | string | Current API version in use |
| sandboxUrl | string | Vendor sandbox/test environment URL |
| status | enum | active, deprecated, disabled |

### ApiChange

Represents a detected change to a vendor API.

| Field | Type | Description |
|-------|------|-------------|
| changeId | string | Unique identifier |
| vendorId | string | Reference to VendorIntegration |
| changeType | enum | breaking, deprecation, new-feature, security |
| severity | enum | low, medium, high, critical |
| version | string | API version introducing the change |
| summary | string | Human-readable description of the change |
| affectedEndpoints | string[] | List of affected API endpoints |
| effectiveDate | date | When the change takes effect |
| migrationDeadline | date | Deadline to migrate |
| detectedAt | timestamp | When the agent detected this change |
| status | enum | detected, analyzed, code-generated, tested, deployed |

### HealthCheckResult

Point-in-time snapshot of vendor API health.

| Field | Type | Description |
|-------|------|-------------|
| vendorId | string | Reference to VendorIntegration |
| status | enum | healthy, degraded, down |
| latencyMs | number | Response time in milliseconds |
| errorRate | number | Error rate (0.0 to 1.0) |
| lastChecked | timestamp | When this check was performed |
| details | string | Additional context |

### Deployment

Record of an adapter code deployment.

| Field | Type | Description |
|-------|------|-------------|
| deploymentId | string | Unique identifier |
| vendorId | string | Reference to VendorIntegration |
| environment | enum | staging, production |
| strategy | enum | rolling, blue-green, canary |
| status | enum | success, failed, pending-approval, rolled-back |
| branch | string | Git branch containing the changes |
| rollbackId | string | Reference to rollback point |
| triggeredBy | string | Agent or user who triggered deployment |
| startedAt | timestamp | Deployment start time |
| completedAt | timestamp | Deployment completion time |

### TestResult

Result of running integration tests for a vendor adapter.

| Field | Type | Description |
|-------|------|-------------|
| vendorId | string | Reference to VendorIntegration |
| testType | enum | unit, integration, smoke |
| passed | number | Count of passed tests |
| failed | number | Count of failed tests |
| skipped | number | Count of skipped tests |
| duration | string | Total test execution time |
| runAt | timestamp | When tests were executed |

## Relationships

- VendorIntegration 1:N ApiChange (one vendor can have many changes)
- VendorIntegration 1:N HealthCheckResult (health checked over time)
- VendorIntegration 1:N Deployment (deployed multiple times)
- VendorIntegration 1:N TestResult (tested multiple times)
- ApiChange 1:1 Deployment (a change triggers a deployment)
