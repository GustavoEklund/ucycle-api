import { Exception } from '@/domain/entities/errors'

export class DocumentAlreadyExistsError extends Exception {
  public constructor(documentNumber: string) {
    super('DocumentAlreadyExistsError', `document number ${documentNumber} already exists`)
  }
}
