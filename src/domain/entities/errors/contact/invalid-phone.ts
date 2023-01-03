import { DomainException } from '@/domain/entities/errors'

export class InvalidPhoneError extends DomainException {
  public constructor(number: string) {
    super('InvalidPhoneError', `phone number ${number} is invalid`)
  }
}
