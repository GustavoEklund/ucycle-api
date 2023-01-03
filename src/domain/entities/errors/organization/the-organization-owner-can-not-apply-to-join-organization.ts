import { DomainException } from '@/domain/entities/errors'

export class TheOrganizationOwnerCanNotApplyToJoinOrganizationError extends DomainException {
  public constructor() {
    super(
      'TheOrganizationOwnerCanNotApplyToJoinOrganizationError',
      'the organization owner can not apply to join the organization'
    )
  }
}
