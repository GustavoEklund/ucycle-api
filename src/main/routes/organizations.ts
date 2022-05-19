import { Router } from 'express'
import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeAddOrganizationsController,
  makeApplyToJoinOrganizationController,
  makeLoadMyOrganizationsController,
} from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/organizations', adapt(makeAddOrganizationsController()))
  router.get(
    '/users/:userId/organizations',
    adaptKeycloakProtect(`realm:default-roles${env.keycloak.realm}`),
    adapt(makeLoadMyOrganizationsController())
  )
  router.post(
    '/organizations/:organizationId/apply-to-join',
    adaptKeycloakProtect(`realm:default-roles${env.keycloak.realm}`),
    adapt(makeApplyToJoinOrganizationController())
  )
}
