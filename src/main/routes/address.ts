import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'

import { Router } from 'express'
import {
  makeAddAddressController,
  makeRemoveAddressController,
} from '@/main/factories/application/controllers/address'
import { makeSetAddressDefaultController } from '@/main/factories/application/controllers/address/set-address-default'

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
}
