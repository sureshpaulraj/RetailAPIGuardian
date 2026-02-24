# Quickstart — Azure Deployment Infrastructure

## Prerequisites
- Node.js 18+
- Azure CLI (`az`)
- Bicep CLI (`az bicep install`)
- Azure subscription with permissions to create networking and App Service resources

## Local Run
```bash
npm install
npx tsx src/agent/index.ts
```

## Azure Deployment (planned)
```bash
az login
az account set --subscription <subscription-id>

# Create resource group
az group create --name <rg-name> --location <region>

# Deploy Bicep (to be added in /infra)
az deployment group create \
  --resource-group <rg-name> \
  --template-file infra/main.bicep \
  --parameters infra/parameters.dev.json
```

## Configuration
- Web App uses managed identity to access Key Vault.
- PostgreSQL and Redis are private; access via VNET integration.
- Application Gateway exposes the Web App as the public entry point.
