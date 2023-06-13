import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeAddAddressController,
  makeLoadMyAddressesController,
  makeRemoveAddressController,
  makeSetAddressDefaultController,
} from '@/main/factories/application/controllers/address'

import { Router } from 'express'

export default (router: Router): void => {
  router.post(
    '/address',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeAddAddressController())
  )
  router.patch(
    '/address/:addressId/set-default',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeSetAddressDefaultController())
  )
  router.delete(
    '/address/:addressId',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeRemoveAddressController())
  )
  router.get(
    '/addresses',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeLoadMyAddressesController())
  )
}
