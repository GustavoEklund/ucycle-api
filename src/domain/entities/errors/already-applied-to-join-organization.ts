export class AlreadyAppliedToJoinOrganizationError extends Error {
  public constructor(organizationId: string) {
    super(`you have already applied to join organization ${organizationId}`)
    this.name = 'AlreadyAppliedToJoinOrganizationError'
  }
}
