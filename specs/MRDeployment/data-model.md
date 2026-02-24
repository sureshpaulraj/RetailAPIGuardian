# Data Model — RetailAPIGuardian

## Entities

### VendorIntegration
- **Fields**: id, name, baseUrl, authMethod, adapterPath, healthStatus, lastCheckedAt
- **Relationships**: has many APIChange, has many HealthCheckResult
- **Validation**: `authMethod` in {apiKey, oauth2, mTLS}; `name` unique

### APIChange
- **Fields**: id, vendorId, changeType, severity, affectedEndpoints, effectiveDate, migrationDeadline, status
- **Relationships**: belongs to VendorIntegration
- **Validation**: `changeType` in {breaking, deprecation, security, feature}; `severity` in {low, medium, high, critical}
- **State transitions**: detected -> triaged -> mitigated -> verified

### Adapter
- **Fields**: id, vendorId, filePath, version, lastUpdatedAt, lastTestResult
- **Relationships**: belongs to VendorIntegration
- **Validation**: `version` semantic versioning; `filePath` must exist in repo
- **State transitions**: draft -> tested -> deployed

### Deployment
- **Fields**: id, vendorId, environment, strategy, status, deploymentId, rollbackId, createdAt, completedAt
- **Relationships**: belongs to VendorIntegration
- **Validation**: `strategy` in {canary, blueGreen, rolling}; `environment` in {dev, staging, prod}
- **State transitions**: planned -> in_progress -> succeeded | failed -> rolled_back

### HealthCheckResult
- **Fields**: id, vendorId, status, latencyMs, errorRate, checkedAt
- **Relationships**: belongs to VendorIntegration
- **Validation**: `status` in {healthy, degraded, down}; `errorRate` between 0 and 1

## Notes
- Telemetry fields (correlationId, traceId) are captured in logs rather than persisted in core entities.
