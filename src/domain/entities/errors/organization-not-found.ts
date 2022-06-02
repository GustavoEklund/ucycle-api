import { Exception } from '@/domain/entities/errors'

export class OrganizationNotFoundError extends Exception {
  public constructor(id: string) {
    super('OrganizationNotFoundError', `organization with id ${id} not found`)
  }
}
