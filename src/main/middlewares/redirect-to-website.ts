import { env } from '@/main/config/env'

import { NextFunction, Request, Response } from 'express'

export const redirectToWebsite = (req: Request, res: Response, next: NextFunction): void => {
  req.path === '/' ? res.redirect(301, env.server.mainWebsiteUrl) : next()
}
