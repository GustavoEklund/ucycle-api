import { DomainException } from '@/domain/entities/errors'

export class ContactAlreadyVerifiedError extends DomainException {
  public constructor(contactValue: string) {
    const message = `contact ${contactValue} is already verified`
    super('ContactAlreadyVerifiedError', message)
  }
}
