import { DomainException } from '@/domain/entities/errors'

export class UnauthorizedUserError extends DomainException {
  public constructor(userId: string, permissionCode: string) {
    const message = `user with id ${userId} has no ${permissionCode} permission to perform this action`
    super('UnauthorizedUserError', message)
  }
}
