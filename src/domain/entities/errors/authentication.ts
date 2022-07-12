import { Exception } from '@/domain/entities/errors'

export class AuthenticationError extends Exception {
  public constructor() {
    super('AuthenticationError', 'authentication failed')
  }
}
