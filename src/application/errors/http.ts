export class ServerError extends Error {
  public constructor(error?: Error) {
    super('server failed, try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  public constructor() {
    super('unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  public constructor() {
    super('access denied')
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends Error {
  public constructor() {
    super('resource not found')
    this.name = 'NotFoundError'
  }
}
