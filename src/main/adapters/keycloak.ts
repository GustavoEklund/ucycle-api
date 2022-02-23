import { RequestHandler } from 'express'
import { keycloak } from '@/main/config/keycloak'
import { ServerError } from '@/application/errors'

export const adaptKeycloakProtect =
  (spec: string): RequestHandler =>
  (req, res, next) => {
    const protect = keycloak.protect(spec)
    protect(req, res, (error) => {
      if (error !== undefined) {
        return res.status(500).json({ error: new ServerError(error).message })
      }
      if (req.kauth !== undefined) {
        req.locals = {
          ...req.locals,
          userId: req.kauth.grant?.accessToken?.content?.sub,
        }
      }
      next()
    })
  }
