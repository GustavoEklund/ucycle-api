import { memoryStore } from '@/main/middlewares/session'

import KeycloakConnect, { KeycloakConfig } from 'keycloak-connect'
import { Request, Response } from 'express'
import { env } from '@/main/config/env'

KeycloakConnect.prototype.accessDenied = (req: Request, res: Response): void => {
  res.status(403).json({ errors: [{ code: 'FORBIDDEN', message: 'forbidden' }] })
}
KeycloakConnect.prototype.redirectToLogin = (req: Request): boolean => {
  const apiReqMatcher = /\/api\//i
  const isRequestFromApi = apiReqMatcher.test(req.originalUrl || req.url)
  return !isRequestFromApi
}
const keycloakConfig: KeycloakConfig = {
  realm: env.keycloak.realm,
  'auth-server-url': env.keycloak.authServerUrl,
  'ssl-required': 'external',
  resource: env.keycloak.protectClientId,
  'confidential-port': 0,
}
export const keycloak = new KeycloakConnect({ store: memoryStore }, keycloakConfig)
