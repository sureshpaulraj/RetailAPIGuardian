targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Resource name prefix.')
param namePrefix string

@description('Deployment environment name (dev, staging, prod).')
param environment string

@description('App Service plan SKU name (e.g., P1v3).')
param appServicePlanSkuName string = 'P1v3'

@description('App Service plan SKU tier (e.g., PremiumV3).')
param appServicePlanSkuTier string = 'PremiumV3'

@description('App Service plan instance count.')
param appServicePlanCapacity int = 1

@description('Subnet ID for App Service VNET integration.')
param appServiceSubnetId string

@description('Application Insights connection string.')
param appInsightsConnectionString string

@description('Resource tags applied to all resources.')
param tags object = {}

var planName = '${namePrefix}-asp'
var webAppName = '${namePrefix}-web-${environment}'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  tags: tags
  sku: {
    name: appServicePlanSkuName
    tier: appServicePlanSkuTier
    capacity: appServicePlanCapacity
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    virtualNetworkSubnetId: appServiceSubnetId
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'APPINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
      ]
    }
  }
}

output appServicePlanId string = appServicePlan.id
output webAppId string = webApp.id
output webAppName string = webApp.name
output webAppDefaultHostName string = webApp.properties.defaultHostName
output webAppPrincipalId string = webApp.identity.principalId
