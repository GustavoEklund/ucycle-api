import { DomainException } from '@/domain/entities/errors'

export class DocumentAlreadyExistsError extends DomainException {
  public constructor(documentNumber: string) {
    super('DocumentAlreadyExistsError', `document number ${documentNumber} already exists`)
  }
}
