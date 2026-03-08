targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Deployment environment name (dev, staging, prod).')
param environment string

@description('Resource name prefix.')
param namePrefix string

@description('Tags applied to all resources.')
param tags object = {}

@description('Address space for the virtual network.')
param vnetAddressPrefix string = '10.60.0.0/16'

@description('Subnet CIDR for Application Gateway.')
param appGatewaySubnetPrefix string = '10.60.0.0/24'

@description('Subnet CIDR for App Service VNET integration.')
param appServiceSubnetPrefix string = '10.60.1.0/24'

@description('Subnet CIDR for private endpoints.')
param privateEndpointsSubnetPrefix string = '10.60.2.0/24'

@description('PostgreSQL administrator login name.')
param postgresAdminLogin string

@description('PostgreSQL administrator password.')
@secure()
param postgresAdminPassword string

@description('PostgreSQL SKU name (e.g., Standard_D2s_v3).')
param postgresSkuName string = 'Standard_D2s_v3'

@description('PostgreSQL SKU tier (e.g., GeneralPurpose).')
param postgresSkuTier string = 'GeneralPurpose'

@description('PostgreSQL storage size in GB.')
param postgresStorageSizeGb int = 128

@description('Redis SKU name (Basic, Standard, Premium).')
param redisSkuName string = 'Standard'

@description('Redis SKU family (C for Basic/Standard, P for Premium).')
param redisSkuFamily string = 'C'

@description('Redis SKU capacity (0-6 depending on SKU).')
param redisSkuCapacity int = 1

@description('App Service plan SKU name (e.g., P1v3).')
param appServicePlanSkuName string = 'P1v3'

@description('App Service plan SKU tier (e.g., PremiumV3).')
param appServicePlanSkuTier string = 'PremiumV3'

@description('App Service plan instance count.')
param appServicePlanCapacity int = 1

@description('Application Gateway capacity (instance count).')
param appGatewayCapacity int = 1

module network 'modules/network.bicep' = {
	name: '${namePrefix}-network'
	params: {
		location: location
		namePrefix: namePrefix
		vnetAddressPrefix: vnetAddressPrefix
		appGatewaySubnetPrefix: appGatewaySubnetPrefix
		appServiceSubnetPrefix: appServiceSubnetPrefix
		privateEndpointsSubnetPrefix: privateEndpointsSubnetPrefix
		tags: tags
	}
}

module privateDns 'modules/private-dns.bicep' = {
	name: '${namePrefix}-private-dns'
	params: {
		namePrefix: namePrefix
		vnetId: network.outputs.vnetId
		tags: tags
	}
}

module monitoring 'modules/monitoring.bicep' = {
	name: '${namePrefix}-monitoring'
	params: {
		location: location
		namePrefix: namePrefix
		tags: tags
	}
}

module keyVault 'modules/key-vault.bicep' = {
	name: '${namePrefix}-keyvault'
	params: {
		location: location
		namePrefix: namePrefix
		privateEndpointSubnetId: network.outputs.privateEndpointsSubnetId
		keyVaultPrivateDnsZoneId: privateDns.outputs.keyVaultPrivateDnsZoneId
		tags: tags
	}
}

module postgres 'modules/postgres.bicep' = {
	name: '${namePrefix}-postgres'
	params: {
		location: location
		namePrefix: namePrefix
		administratorLogin: postgresAdminLogin
		administratorPassword: postgresAdminPassword
		postgresSkuName: postgresSkuName
		postgresSkuTier: postgresSkuTier
		storageSizeGb: postgresStorageSizeGb
		privateEndpointSubnetId: network.outputs.privateEndpointsSubnetId
		postgresPrivateDnsZoneId: privateDns.outputs.postgresPrivateDnsZoneId
		tags: tags
	}
}

module redis 'modules/redis.bicep' = {
	name: '${namePrefix}-redis'
	params: {
		location: location
		namePrefix: namePrefix
		redisSkuName: redisSkuName
		redisSkuFamily: redisSkuFamily
		redisSkuCapacity: redisSkuCapacity
		privateEndpointSubnetId: network.outputs.privateEndpointsSubnetId
		redisPrivateDnsZoneId: privateDns.outputs.redisPrivateDnsZoneId
		tags: tags
	}
}

module appService 'modules/app-service.bicep' = {
	name: '${namePrefix}-app-service'
	params: {
		location: location
		namePrefix: namePrefix
		environment: environment
		appServicePlanSkuName: appServicePlanSkuName
		appServicePlanSkuTier: appServicePlanSkuTier
		appServicePlanCapacity: appServicePlanCapacity
		appServiceSubnetId: network.outputs.appServiceSubnetId
		appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
		tags: tags
	}
}

module appGateway 'modules/app-gateway.bicep' = {
	name: '${namePrefix}-app-gateway'
	params: {
		location: location
		namePrefix: namePrefix
		appGatewaySubnetId: network.outputs.appGatewaySubnetId
		backendHostName: appService.outputs.webAppDefaultHostName
		capacity: appGatewayCapacity
		tags: tags
	}
}

output webAppName string = appService.outputs.webAppName
output webAppPrincipalId string = appService.outputs.webAppPrincipalId
output appGatewayPublicIp string = appGateway.outputs.appGatewayPublicIp
output keyVaultUri string = keyVault.outputs.keyVaultUri
output appInsightsConnectionString string = monitoring.outputs.appInsightsConnectionString
