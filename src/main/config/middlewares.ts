// Keycloak
import { contentType } from '@/main/middlewares/content-type'
import { keycloak } from '@/main/config/keycloak'

import cors from 'cors'
import { Express, json } from 'express'

export const setupMiddlewares = (app: Express): void => {
  app.use(cors())
  app.use(json())
  app.use(contentType)
  app.use(keycloak.middleware({ logout: '/logout', admin: '/' }))
}
