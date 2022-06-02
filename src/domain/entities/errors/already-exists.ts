import { Exception } from '@/domain/entities/errors'

export class AlreadyExistsError extends Exception {
  public constructor(id: string, entity: string) {
    super('AlreadyExistsError', `${entity} with id ${id} already exists`)
  }
}
