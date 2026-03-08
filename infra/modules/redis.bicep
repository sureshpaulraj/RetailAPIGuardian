targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Resource name prefix.')
param namePrefix string

@description('Redis SKU name (Basic, Standard, Premium).')
param redisSkuName string = 'Standard'

@description('Redis SKU family (C for Basic/Standard, P for Premium).')
param redisSkuFamily string = 'C'

@description('Redis SKU capacity (0-6 depending on SKU).')
param redisSkuCapacity int = 1

@description('Subnet ID for the Redis private endpoint.')
param privateEndpointSubnetId string

@description('Private DNS zone ID for Redis.')
param redisPrivateDnsZoneId string

@description('Resource tags applied to all resources.')
param tags object = {}

var redisName = '${namePrefix}-redis'

resource redis 'Microsoft.Cache/Redis@2023-08-01' = {
  name: redisName
  location: location
  tags: tags
  properties: {
    sku: {
      name: redisSkuName
      family: redisSkuFamily
      capacity: redisSkuCapacity
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Disabled'
  }
}

resource redisPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-redis-pe'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${redisName}-pe-conn'
        properties: {
          privateLinkServiceId: redis.id
          groupIds: [
            'redisCache'
          ]
          requestMessage: 'Redis private endpoint'
        }
      }
    ]
  }
}

resource redisDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  name: 'default'
  parent: redisPrivateEndpoint
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'redis-zone'
        properties: {
          privateDnsZoneId: redisPrivateDnsZoneId
        }
      }
    ]
  }
}

output redisId string = redis.id
output redisName string = redis.name
output redisPrivateEndpointId string = redisPrivateEndpoint.id
