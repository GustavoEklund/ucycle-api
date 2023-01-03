import { DomainException } from '@/domain/entities/errors'

export class ContactNotFoundError extends DomainException {
  public constructor(value?: string) {
    const message = value ? `contact with value ${value} not found` : 'contact not found'
    super('ContactNotFoundError', message)
  }
}
