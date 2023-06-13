import { ServerError } from '@/application/errors'

import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const uploads = multer().array('pictures')
  uploads(req, res, (error) => {
    if (error !== undefined) {
      return res.status(500).json({ error: new ServerError(error).message })
    }
    if (req.files !== undefined && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        req.locals = {
          ...req.locals,
          files: [...(req.locals?.files ?? []), { buffer: file.buffer, mimeType: file.mimetype }],
        }
      })
    }
    next()
  })
}
