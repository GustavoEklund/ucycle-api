import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import { makeLoadMySalesController } from '@/main/factories/application/controllers/order'

import { Router } from 'express'

export default (router: Router): void => {
  router.get(
    '/sales',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeLoadMySalesController())
  )
}
