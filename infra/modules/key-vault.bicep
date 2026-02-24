targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Resource name prefix.')
param namePrefix string

@description('Subnet ID for the Key Vault private endpoint.')
param privateEndpointSubnetId string

@description('Private DNS zone ID for Key Vault.')
param keyVaultPrivateDnsZoneId string

@description('Resource tags applied to all resources.')
param tags object = {}

var keyVaultName = '${namePrefix}-kv'

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    enableRbacAuthorization: true
    publicNetworkAccess: 'Disabled'
    networkAcls: {
      defaultAction: 'Deny'
      bypass: 'AzureServices'
    }
  }
}

resource keyVaultPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-kv-pe'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${keyVaultName}-pe-conn'
        properties: {
          privateLinkServiceId: keyVault.id
          groupIds: [
            'vault'
          ]
          requestMessage: 'Key Vault private endpoint'
        }
      }
    ]
  }
}

resource keyVaultDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  name: 'default'
  parent: keyVaultPrivateEndpoint
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'keyvault-zone'
        properties: {
          privateDnsZoneId: keyVaultPrivateDnsZoneId
        }
      }
    ]
  }
}

output keyVaultId string = keyVault.id
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
output keyVaultPrivateEndpointId string = keyVaultPrivateEndpoint.id
