import { Exception } from '@/domain/entities/errors'

export class UserAccountNotFoundError extends Exception {
  public constructor(id: string) {
    super('UserAccountNotFoundError', `user account with id ${id} not found`)
  }
}
