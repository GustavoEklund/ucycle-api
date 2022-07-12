import { Exception } from '@/domain/entities/errors'

export class InvalidDocumentError extends Exception {
  public constructor() {
    super('InvalidDocumentError', `invalid document`)
  }
}
