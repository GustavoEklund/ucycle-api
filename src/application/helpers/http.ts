import { ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from '@/application/errors'

export enum HttpStatus {
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  serverError = 500,
}

export type HttpResponse<T = any, H = any> = {
  statusCode: number
  data: T
  headers?: H
  error?: Error
}

export type HttpRequest = {
  url: string
  headers?: object
  body?: object | string | URLSearchParams
}

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  data,
})

export const created = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  data,
})

export const accepted = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 202,
  data,
})

export const noContent = (): HttpResponse<undefined> => ({
  statusCode: 204,
  data: undefined,
})

export const badRequest = (errors: Error[]): HttpResponse<Error[]> => ({
  statusCode: 400,
  data: errors,
})

export const unauthorized = (): HttpResponse<Error[]> => ({
  statusCode: 401,
  data: [new UnauthorizedError()],
})

export const forbidden = (errors?: Error[]): HttpResponse<Error[]> => ({
  statusCode: 403,
  data: errors ?? [new ForbiddenError()],
})

export const notFound = (errors?: Error[]): HttpResponse<Error[]> => ({
  statusCode: 404,
  data: errors ?? [new NotFoundError()],
})

export const conflict = (errors: Error[]): HttpResponse<Error[]> => ({
  statusCode: 409,
  data: errors,
})

export const unprocessableEntity = (errors: Error[]): HttpResponse<Error[]> => ({
  statusCode: 422,
  data: errors,
})

export const serverError = (error: unknown): HttpResponse<Error[]> => ({
  statusCode: 500,
  data: [new ServerError(error instanceof Error ? error : undefined)],
})

export const isServerError = (httpResponse: HttpResponse<any>): boolean => {
  return httpResponse.statusCode === HttpStatus.serverError
}

export const isError = (httpResponse: HttpResponse<any>): boolean => {
  const errorStatuses = [
    HttpStatus.badRequest,
    HttpStatus.unauthorized,
    HttpStatus.forbidden,
    HttpStatus.notFound,
    HttpStatus.conflict,
    HttpStatus.serverError,
  ]
  return errorStatuses.includes(httpResponse.statusCode)
}

export const HttpResponse = {
  ok,
  created,
  accepted,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  serverError,
  isError,
  isServerError,
}
