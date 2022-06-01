import { Exception } from '@/domain/entities/errors/exception'

export class TheOrganizationOwnerCanNotApplyToJoinOrganizationError extends Exception {
  public constructor() {
    super(
      'TheOrganizationOwnerCanNotApplyToJoinOrganizationError',
      'the organization owner can not apply to join the organization'
    )
  }
}
