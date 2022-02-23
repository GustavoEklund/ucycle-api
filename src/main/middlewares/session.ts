import { env } from '@/main/config/env'

import session, { MemoryStore, SessionOptions } from 'express-session'
import { Express } from 'express'

export const memoryStore = new MemoryStore()

export const setupExpressSession = (app: Express): void => {
  const sessionOptions: SessionOptions = {
    secret: env.session.secret,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    cookie: {
      maxAge: Number(env.session.cookie.maxAge),
      secure: !env.server.devMode,
    },
  }
  app.use(session(sessionOptions))
}
