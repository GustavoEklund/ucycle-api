import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeCheckoutController,
  makeLoadMyOrdersController,
  makePayOrderController,
} from '@/main/factories/application/controllers/order'
import { LoadOrderDetailsController } from '@/application/controllers/order/load-order-details'

import { Router } from 'express'

export default (router: Router): void => {
  router.post(
    '/order/checkout',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeCheckoutController())
  )
  router.get(
    '/orders',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeLoadMyOrdersController())
  )
  router.get(
    '/orders/:code',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(new LoadOrderDetailsController())
  )
  router.post(
    '/orders/:orderCode/pay',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makePayOrderController())
  )
}
