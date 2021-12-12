export class AuthenticationError extends Error {
  constructor() {
    super('authentication failed')
    this.name = 'AuthenticationError'
  }
}
