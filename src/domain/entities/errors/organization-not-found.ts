export class OrganizationNotFoundError extends Error {
  public constructor(id: string) {
    super(`organization with id ${id} not found`)
    this.name = 'OrganizationNotFoundError'
  }
}
