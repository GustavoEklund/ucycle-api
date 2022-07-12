import { Exception } from '@/domain/entities/errors'

export class BasePermissionNotFoundError extends Exception {
  public constructor(code: string) {
    super('BasePermissionNotFoundError', `base permission with code ${code} not found`)
  }
}
