import { Exception } from '@/domain/entities/errors/exception'

export class UnauthorizedUserError extends Exception {
  public constructor(userId: string, permissionCode: string) {
    super(
      'UnauthorizedUser',
      `user with id ${userId} has no ${permissionCode} permission to perform this action`
    )
  }
}
