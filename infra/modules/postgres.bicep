targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Resource name prefix.')
param namePrefix string

@description('PostgreSQL administrator login name.')
param administratorLogin string

@description('PostgreSQL administrator password.')
@secure()
param administratorPassword string

@description('PostgreSQL version.')
param postgresVersion string = '16'

@description('PostgreSQL SKU name (e.g., Standard_D2s_v3).')
param postgresSkuName string = 'Standard_D2s_v3'

@description('PostgreSQL SKU tier (e.g., GeneralPurpose).')
param postgresSkuTier string = 'GeneralPurpose'

@description('PostgreSQL storage size in GB.')
param storageSizeGb int = 128

@description('Subnet ID for the PostgreSQL private endpoint.')
param privateEndpointSubnetId string

@description('Private DNS zone ID for PostgreSQL.')
param postgresPrivateDnsZoneId string

@description('Resource tags applied to all resources.')
param tags object = {}

var postgresName = '${namePrefix}-pg'

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01' = {
  name: postgresName
  location: location
  tags: tags
  sku: {
    name: postgresSkuName
    tier: postgresSkuTier
  }
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    version: postgresVersion
    storage: {
      storageSizeGB: storageSizeGb
    }
    network: {
      publicNetworkAccess: 'Disabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
  }
}

resource postgresPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-pg-pe'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${postgresName}-pe-conn'
        properties: {
          privateLinkServiceId: postgres.id
          groupIds: [
            'postgresqlServer'
          ]
          requestMessage: 'PostgreSQL private endpoint'
        }
      }
    ]
  }
}

resource postgresDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  name: 'default'
  parent: postgresPrivateEndpoint
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'postgres-zone'
        properties: {
          privateDnsZoneId: postgresPrivateDnsZoneId
        }
      }
    ]
  }
}

output postgresServerId string = postgres.id
output postgresServerName string = postgres.name
output postgresPrivateEndpointId string = postgresPrivateEndpoint.id
