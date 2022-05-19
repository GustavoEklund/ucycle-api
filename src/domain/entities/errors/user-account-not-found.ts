export class UserAccountNotFoundError extends Error {
  public constructor(id: string) {
    super(`user account with id ${id} not found`)
    this.name = 'UserAccountNotFoundError'
  }
}
