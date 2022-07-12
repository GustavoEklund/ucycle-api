import { Exception } from '@/domain/entities/errors'

export class ServerError extends Exception {
  public constructor(error?: Error) {
    super('ServerError', 'server failed, try again soon')
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Exception {
  public constructor() {
    super('UnauthorizedError', 'unauthorized')
  }
}

export class ForbiddenError extends Exception {
  public constructor() {
    super('ForbiddenError', 'access denied')
  }
}

export class NotFoundError extends Exception {
  public constructor() {
    super('NotFoundError', 'resource not found')
  }
}
