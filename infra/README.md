# Azure Deployment (Bicep)

## Prerequisites
- Azure CLI (`az`)
- Bicep CLI (`az bicep install`)
- Access to create resources in the target subscription

## Deploy
```bash
az login
az account set --subscription <subscription-id>

az group create --name <rg-name> --location <region>

az deployment group create \
  --resource-group <rg-name> \
  --template-file infra/main.bicep \
  --parameters infra/parameters/dev.json
```

## Notes
- Replace `<REPLACE-WITH-SECRET>` values in parameter files before deployment.
- App Gateway uses HTTP (port 80) by default; add TLS listener and certs for production.
- App Service uses managed identity; grant it access to Key Vault secrets as needed.
