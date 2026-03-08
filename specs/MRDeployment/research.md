# Research — Azure Deployment Infrastructure

## Decisions

### Hosting and Ingress
- **Decision**: Use Azure App Service (Linux Web App) with VNET integration, fronted by Azure Application Gateway (WAF v2).
- **Rationale**: App Service fits the existing Node.js runtime and scaling model, while Application Gateway provides WAF, TLS termination, and private backend routing.
- **Alternatives considered**: Azure Container Apps, AKS, Azure Front Door (rejected due to higher ops complexity or public backend exposure).

### Private Networking
- **Decision**: Deploy all data stores (PostgreSQL, Redis, Key Vault) with private endpoints in a VNET. Use dedicated subnets for App Gateway, App Service integration, and private endpoints.
- **Rationale**: Meets security constraints (no public data plane), aligns with PCI DSS, and reduces exposure risk.
- **Alternatives considered**: Public endpoints with firewall rules (rejected due to compliance and risk).

### Database Choice
- **Decision**: Use Azure Database for PostgreSQL Flexible Server ("ProgressSQL" interpreted as PostgreSQL).
- **Rationale**: Managed PostgreSQL with private networking support and predictable performance.
- **Alternatives considered**: Azure SQL, Cosmos DB only (rejected due to requirement for PostgreSQL).

### Caching
- **Decision**: Use Azure Cache for Redis with private endpoint support.
- **Rationale**: Low-latency caching for integration health snapshots and change analysis results.
- **Alternatives considered**: In-memory cache only (rejected due to scale and resiliency).

### Secrets and Identity
- **Decision**: Use Azure Key Vault with managed identity from the Web App.
- **Rationale**: Eliminates secrets in code, aligns with security requirements.
- **Alternatives considered**: App Service configuration secrets only (rejected due to compliance guidance).

### Infrastructure as Code
- **Decision**: Use Bicep templates in `/infra` with parameter files per environment.
- **Rationale**: Native Azure IaC, readable and maintainable.
- **Alternatives considered**: ARM JSON, Terraform (rejected to keep Azure-native alignment).

## Best Practices Applied
- Separate subnets for App Gateway, VNET integration, and private endpoints.
- Private DNS zones for `privatelink.*` resources.
- App Service outbound traffic routed through VNET integration where required.
- Application Gateway WAF policies for baseline protection.

## Open Items
- Confirm SKU sizing for PostgreSQL and Redis per expected vendor volume.
- Confirm whether API Management is deployed within the same VNET or peered VNET.
