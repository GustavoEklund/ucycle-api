export class AlreadyExistsError extends Error {
  public constructor(id: string, entity: string) {
    super(`${entity} with id ${id} already exists`)
    this.name = 'TestAlreadyExistsError'
  }
}
