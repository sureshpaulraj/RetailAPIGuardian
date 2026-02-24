targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Resource name prefix.')
param namePrefix string

@description('Address space for the virtual network.')
param vnetAddressPrefix string = '10.60.0.0/16'

@description('Subnet CIDR for Application Gateway.')
param appGatewaySubnetPrefix string = '10.60.0.0/24'

@description('Subnet CIDR for App Service VNET integration.')
param appServiceSubnetPrefix string = '10.60.1.0/24'

@description('Subnet CIDR for private endpoints.')
param privateEndpointsSubnetPrefix string = '10.60.2.0/24'

@description('Resource tags applied to all resources.')
param tags object = {}

var vnetName = '${namePrefix}-vnet'
var appGatewaySubnetName = 'snet-app-gateway'
var appServiceSubnetName = 'snet-app-service'
var privateEndpointsSubnetName = 'snet-private-endpoints'

resource appGatewayNsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = {
  name: '${namePrefix}-nsg-appgw'
  location: location
  tags: tags
}

resource appServiceNsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = {
  name: '${namePrefix}-nsg-appsvc'
  location: location
  tags: tags
}

resource privateEndpointsNsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = {
  name: '${namePrefix}-nsg-pe'
  location: location
  tags: tags
}

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: vnetName
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
    subnets: [
      {
        name: appGatewaySubnetName
        properties: {
          addressPrefix: appGatewaySubnetPrefix
          networkSecurityGroup: {
            id: appGatewayNsg.id
          }
        }
      }
      {
        name: appServiceSubnetName
        properties: {
          addressPrefix: appServiceSubnetPrefix
          networkSecurityGroup: {
            id: appServiceNsg.id
          }
          delegations: [
            {
              name: 'appservice-delegation'
              properties: {
                serviceName: 'Microsoft.Web/serverFarms'
              }
            }
          ]
        }
      }
      {
        name: privateEndpointsSubnetName
        properties: {
          addressPrefix: privateEndpointsSubnetPrefix
          networkSecurityGroup: {
            id: privateEndpointsNsg.id
          }
          privateEndpointNetworkPolicies: 'Disabled'
          privateLinkServiceNetworkPolicies: 'Enabled'
        }
      }
    ]
  }
}

output vnetId string = vnet.id
output vnetName string = vnet.name
output appGatewaySubnetId string = vnet.properties.subnets[0].id
output appServiceSubnetId string = vnet.properties.subnets[1].id
output privateEndpointsSubnetId string = vnet.properties.subnets[2].id
output appGatewayNsgId string = appGatewayNsg.id
output appServiceNsgId string = appServiceNsg.id
output privateEndpointsNsgId string = privateEndpointsNsg.id
