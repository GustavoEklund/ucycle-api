export class InvalidEmailError extends Error {
  public constructor() {
    super(`invalid email`)
    this.name = 'InvalidEmailError'
  }
}
