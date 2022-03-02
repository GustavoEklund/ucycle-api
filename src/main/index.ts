import './config/module-alias'
import { env } from '@/main/config/env'

import 'reflect-metadata'
import { PgConnection } from '@/infra/repos/postgres/helpers'

PgConnection.getInstance()
  .connect()
  .then(async () => {
    const { app } = await import('@/main/config/app')
    const message = `[INFO] Server running at http://localhost:${env.server.port}`
    app.listen(env.server.port, () => console.log(message))
  })
  .catch(console.error)
