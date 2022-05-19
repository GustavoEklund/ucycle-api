export class InvalidDocumentError extends Error {
  public constructor() {
    super(`invalid document`)
    this.name = 'InvalidDocumentError'
  }
}
