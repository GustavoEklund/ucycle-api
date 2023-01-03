import { Router } from 'express'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import {
  makeAddContactController,
  makeSignUpController,
  makeVerifyContactController,
} from '@/main/factories/application/controllers'
import { env } from '@/main/config/env'

export default (router: Router): void => {
  router.post('/users/signup', adapt(makeSignUpController()))
  router.post(
    '/users/contact',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeAddContactController())
  )
  router.post(
    '/users/contact/verify',
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeVerifyContactController())
  )
}
