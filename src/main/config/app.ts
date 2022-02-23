import { setupMiddlewares } from '@/main/config/middlewares'
import { setupRoutes } from '@/main/config/routes'

import express from 'express'
import { setupExpressSession } from '@/main/middlewares/session'

const app = express()
setupExpressSession(app)
setupMiddlewares(app)
setupRoutes(app)
export { app }
