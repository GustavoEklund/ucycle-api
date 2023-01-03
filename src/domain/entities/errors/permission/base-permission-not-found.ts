import { DomainException } from '@/domain/entities/errors'

export class BasePermissionNotFoundError extends DomainException {
  public constructor(code: string) {
    super('BasePermissionNotFoundError', `base permission with code ${code} not found`)
  }
}
