# Data Model — Connector Health Dashboard

## Entities

### Connector
- **Fields**: id, name, currentStatus, lastCheckedAt, lastCheckId
- **Relationships**: has many HealthCheckResult, has many ChangeAnalysis
- **Validation**: `currentStatus` in {good, slow, broken}; `name` unique

### HealthCheckResult
- **Fields**: id, connectorId, status, latencyMs, errorRate, checkedAt, details
- **Relationships**: belongs to Connector; belongs to RecheckRequest (optional)
- **Validation**: `status` in {good, slow, broken}; `errorRate` between 0 and 1
- **State transitions**: pending -> completed | failed

### RecheckRequest
- **Fields**: id, scope, connectorIds, requestedAt, completedAt, status
- **Relationships**: has many HealthCheckResult
- **Validation**: `scope` in {all, selected}; `status` in {queued, running, completed, failed}

### ChangeAnalysis
- **Fields**: id, connectorId, status, requestedAt, completedAt, summary, rationale, riskLevel
- **Relationships**: belongs to Connector; has many Recommendation
- **Validation**: `status` in {queued, running, completed, failed}; `riskLevel` in {Low, Medium, High, Critical}

### Recommendation
- **Fields**: id, analysisId, title, description, confidence
- **Relationships**: belongs to ChangeAnalysis
- **Validation**: `confidence` between 0 and 1

## Notes
- Health check history is retained for operational review for at least 18 months and can be filtered by connector and time range.
