import { DomainException } from '@/domain/entities/errors'

export class AlreadyMemberOfOrganizationError extends DomainException {
  public constructor(organizationId: string) {
    super(
      'AlreadyMemberOfOrganizationError',
      `you are already member of organization ${organizationId}`
    )
  }
}
