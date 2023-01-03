import { Router } from 'express'
import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeAddOrganizationsController,
  makeApplyToJoinOrganizationController,
  makeLoadMyOrganizationsController,
  makeUpdateOrganizationController,
} from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post(
    '/organizations',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeAddOrganizationsController())
  )
  router.get(
    '/users/:userId/organizations',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeLoadMyOrganizationsController())
  )
  router.post(
    '/organizations/:organizationId/apply-to-join',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeApplyToJoinOrganizationController())
  )
  router.put(
    '/organizations/:organizationId',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeUpdateOrganizationController())
  )
}
