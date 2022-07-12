import { Controller } from '@/application/controllers'
import { Exception } from '@/domain/entities/errors'

import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  const { statusCode, data } = await controller.handle({
    ...req.query,
    ...req.params,
    ...req.body,
    ...req.headers,
    ...req.locals,
  })
  if ([200, 201, 202, 204].includes(statusCode)) {
    return res.status(statusCode).json(data)
  }
  if (isArrayOfErrors(data)) {
    return res.status(statusCode).json({
      errors: data.map((error: Exception) => ({
        code: error.code,
        message: error.message,
      })),
    })
  }
  if (data instanceof Exception) {
    return res.status(statusCode).json({
      errors: [
        {
          code: data.code,
          message: data.message,
        },
      ],
    })
  }
  return res
    .status(statusCode)
    .json({ errors: [{ code: 'UNKNOWN_ERROR', message: 'an unknown error has occurred' }] })
}

const isArrayOfErrors = (data: any): boolean =>
  Array.isArray(data) && data.every((e) => e instanceof Exception)
