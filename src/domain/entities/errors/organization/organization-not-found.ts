import { DomainException } from '@/domain/entities/errors'

export class OrganizationNotFoundError extends DomainException {
  public constructor(id: string) {
    super('OrganizationNotFoundError', `organization with id ${id} not found`)
  }
}
