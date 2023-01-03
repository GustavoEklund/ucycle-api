import { DomainException } from '@/domain/entities/errors'

export class UserPermissionNotFoundError extends DomainException {
  public constructor(id: string) {
    super('UserPermissionNotFoundError', `user permission with id ${id} not found`)
  }
}
