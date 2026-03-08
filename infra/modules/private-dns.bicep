targetScope = 'resourceGroup'

@description('Resource name prefix.')
param namePrefix string

@description('Virtual network ID to link private DNS zones.')
param vnetId string

@description('Resource tags applied to all resources.')
param tags object = {}

var keyVaultZoneName = 'privatelink.vaultcore.azure.net'
var postgresZoneName = 'privatelink.postgres.database.azure.com'
var redisZoneName = 'privatelink.redis.cache.windows.net'

resource keyVaultZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: keyVaultZoneName
  location: 'global'
  tags: tags
}

resource postgresZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: postgresZoneName
  location: 'global'
  tags: tags
}

resource redisZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: redisZoneName
  location: 'global'
  tags: tags
}

resource keyVaultLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  name: '${namePrefix}-kv-link'
  parent: keyVaultZone
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}

resource postgresLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  name: '${namePrefix}-pg-link'
  parent: postgresZone
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}

resource redisLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  name: '${namePrefix}-redis-link'
  parent: redisZone
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}

output keyVaultPrivateDnsZoneId string = keyVaultZone.id
output postgresPrivateDnsZoneId string = postgresZone.id
output redisPrivateDnsZoneId string = redisZone.id
