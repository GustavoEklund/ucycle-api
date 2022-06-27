import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import { makeGrantPermissionController } from '@/main/factories/application/controllers/permissions'
import { env } from '@/main/config/env'

import { Router } from 'express'

export default (router: Router): void => {
  router.post(
    '/permissions/grant',
    adaptKeycloakProtect(`realm:default-roles${env.keycloak.realm}`),
    adapt(makeGrantPermissionController())
  )
}