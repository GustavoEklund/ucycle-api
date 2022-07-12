import { Router } from 'express'
import { env } from '@/main/config/env'

export default (router: Router): void => {
  router.all('/health-check', (req, res) => {
    env.server.healthCheck.enabled
      ? res.status(200).send({ status: 'ok' })
      : res.status(503).send({ status: 'service unavailable, server is shutting down' })
  })
}
