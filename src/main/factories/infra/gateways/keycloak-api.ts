import { KeycloakApi } from '@/infra/gateways'
import { makeAxiosHttpClient } from '@/main/factories/infra/gateways/axios-client'
import { env } from '@/main/config/env'

export const makeKeycloakApi = (): KeycloakApi => {
  return new KeycloakApi(
    makeAxiosHttpClient(),
    env.keycloak.authServerUrl,
    env.keycloak.realm,
    env.keycloak.clientId,
    env.keycloak.clientSecret
  )
}
