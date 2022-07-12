import { Exception } from '@/domain/entities/errors'

export class UserPermissionNotFoundError extends Exception {
  public constructor(id: string) {
    super('UserPermissionNotFoundError', `user permission with id ${id} not found`)
  }
}
