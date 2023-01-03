import { DomainException } from '@/domain/entities/errors'

export class UserAccountNotFoundError extends DomainException {
  public constructor(id: string) {
    super('UserAccountNotFoundError', `user account with id ${id} not found`)
  }
}
