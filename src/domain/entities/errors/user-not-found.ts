import { Exception } from '@/domain/entities/errors/exception'

export class UserNotFoundError extends Exception {
  public constructor(id: string) {
    super('UserNotFoundError', `user with id ${id} was not found`)
  }
}
