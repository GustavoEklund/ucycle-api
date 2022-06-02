import { Exception } from '@/domain/entities/errors/exception'

export class AlreadyMemberOfOrganizationError extends Exception {
  public constructor(organizationId: string) {
    super(
      'AlreadyMemberOfOrganizationError',
      `you are already member of organization ${organizationId}`
    )
  }
}
