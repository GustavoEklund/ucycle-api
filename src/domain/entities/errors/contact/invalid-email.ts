import { DomainException } from '@/domain/entities/errors'

export class InvalidEmailError extends DomainException {
  public constructor(email: string) {
    super('InvalidEmailError', `email ${email} is invalid`)
  }
}
