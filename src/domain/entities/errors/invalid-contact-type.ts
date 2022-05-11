export class InvalidContactTypeError extends Error {
  public constructor() {
    super(`invalid contact type`)
    this.name = 'InvalidContactTypeError'
  }
}
