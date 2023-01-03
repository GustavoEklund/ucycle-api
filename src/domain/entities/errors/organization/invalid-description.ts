import { DomainException } from '@/domain/entities/errors'

export class InvalidDescriptionError extends DomainException {
  public constructor(description: string) {
    super('InvalidDescriptionError', `the description ${description} is invalid`)
  }
}
