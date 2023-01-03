import { DomainException } from '@/domain/entities/errors'

export class UserNotFoundError extends DomainException {
  public constructor(id: string) {
    super('UserNotFoundError', `user with id ${id} was not found`)
  }
}
