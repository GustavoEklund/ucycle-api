import { Router } from 'express'
import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeAddOrganizationsController,
  makeLoadMyOrganizationsController,
} from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/organizations', adapt(makeAddOrganizationsController()))
  router.get(
    '/users/:userId/organizations',
    adaptKeycloakProtect(`realm:default-roles${env.keycloak.realm}`),
    adapt(makeLoadMyOrganizationsController())
  )
}
