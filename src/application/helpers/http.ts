import { ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from '@/application/errors'

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  data,
})

export const created = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  data,
})

export const noContent = (): HttpResponse<undefined> => ({
  statusCode: 204,
  data: undefined,
})

export const badRequest = (error: Error[]): HttpResponse<Error[]> => ({
  statusCode: 400,
  data: error,
})

export const unauthorized = (): HttpResponse<Error[]> => ({
  statusCode: 401,
  data: [new UnauthorizedError()],
})

export const forbidden = (errors?: Error[]): HttpResponse<Error[]> => ({
  statusCode: 403,
  data: errors ?? [new ForbiddenError()],
})

export const notFound = (error?: Error[]): HttpResponse<Error[]> => ({
  statusCode: 404,
  data: error ?? [new NotFoundError()],
})

export const conflict = (error: Error[]): HttpResponse<Error[]> => ({
  statusCode: 409,
  data: error,
})

export const serverError = (error: unknown): HttpResponse<Error[]> => ({
  statusCode: 500,
  data: [new ServerError(error instanceof Error ? error : undefined)],
})

export const HttpResponse = {
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
}
