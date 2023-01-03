import { DomainException } from '@/domain/entities/errors'

export class AlreadyAppliedToJoinOrganizationError extends DomainException {
  public constructor(organizationId: string) {
    super(
      'AlreadyAppliedToJoinOrganizationError',
      `you have already applied to join organization ${organizationId}`
    )
  }
}
