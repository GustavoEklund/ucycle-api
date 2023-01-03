import { DomainException } from '@/domain/entities/errors'

export class ContactAlreadyExistsError extends DomainException {
  public constructor(value: string) {
    super('ContactAlreadyExistsError', `contact ${value} already exists`)
  }
}
