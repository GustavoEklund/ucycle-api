import { DomainException } from '@/domain/entities/errors'

export class ContactDoesNotBelongToUserError extends DomainException {
  public constructor(contactValue: string, userId: string) {
    const message = `contact ${contactValue} does not belong to user with id ${userId}`
    super('ContactDoesNotBelongToUserError', message)
  }
}
