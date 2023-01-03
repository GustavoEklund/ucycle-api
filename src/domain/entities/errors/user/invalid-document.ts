import { DomainException } from '@/domain/entities/errors'

export class InvalidDocumentError extends DomainException {
  public constructor() {
    super('InvalidDocumentError', `invalid document`)
  }
}
