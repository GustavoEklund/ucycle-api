import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'

import { Router } from 'express'
import { makeCheckoutController } from '@/main/factories/application/controllers/order'

export default (router: Router): void => {
  router.post(
    '/order/checkout',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeCheckoutController())
  )
}
