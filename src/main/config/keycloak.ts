import { env } from '@/main/config/env'
import { memoryStore } from '@/main/middlewares/session'

import KeycloakConnect, { KeycloakConfig } from 'keycloak-connect'

const config: KeycloakConfig = {
  realm: env.keycloak.realm,
  'auth-server-url': env.keycloak.authServerUrl,
  'ssl-required': 'external',
  resource: env.keycloak.clientId,
  'confidential-port': 0,
}

export const keycloak = new KeycloakConnect({ store: memoryStore }, config)
