import { env } from '@/main/config/env'
import { memoryStore } from '@/main/middlewares/session'

import KeycloakConnect, { KeycloakConfig } from 'keycloak-connect'
import { Request, Response } from 'express'

const config: KeycloakConfig = {
  realm: env.keycloak.realm,
  'auth-server-url': env.keycloak.authServerUrl,
  'ssl-required': 'external',
  resource: env.keycloak.protectClientId,
  'confidential-port': 0,
}

KeycloakConnect.prototype.accessDenied = (req: Request, res: Response): void => {
  res.status(401).json({ error: 'access denied' })
}

KeycloakConnect.prototype.redirectToLogin = (req: Request): boolean => {
  const apiReqMatcher = /\/api\//i
  return !apiReqMatcher.test(req.originalUrl || req.url)
}

export const keycloak = new KeycloakConnect({ store: memoryStore }, config)
