import { DomainException } from '@/domain/entities/errors'

export class InvalidContactTypeError extends DomainException {
  public constructor() {
    super('InvalidContactTypeError', `invalid contact type`)
  }
}
