import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeGrantPermissionController,
  makeRevokePermissionController,
} from '@/main/factories/application/controllers/permissions'
import { env } from '@/main/config/env'

import { Router } from 'express'

export default (router: Router): void => {
  router.post(
    '/users/:targetUserId/permissions/code/:code/grant',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeGrantPermissionController())
  )
  router.delete(
    '/users/:targetUserId/permissions/:permissionId/revoke',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeRevokePermissionController())
  )
}
