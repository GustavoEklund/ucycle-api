import { DomainException } from '@/domain/entities/errors'

export class InvalidPermissionCodeError extends DomainException {
  public constructor(code: string) {
    super('InvalidPermissionCodeError', `the permission code ${code} is invalid`)
  }
}
