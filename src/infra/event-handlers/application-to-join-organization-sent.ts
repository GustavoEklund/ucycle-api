import { Observer } from '@/domain/events'
import { Mailer } from '@/domain/contracts/gateways'
import { ApplicationToJoinOrganizationSent } from '@/domain/events/organization'
import { Email } from '@/domain/value-objects/contact'

export class ApplicationToJoinOrganizationSentHandler extends Observer {
  public constructor(private readonly mailer: Mailer) {
    super({ domainEvents: ['APPLICATION_TO_JOIN_ORGANIZATION_SENT'] })
  }

  public async handle({
    admissionProposalId,
    user,
    organization,
  }: ApplicationToJoinOrganizationSent): Promise<void> {
    try {
      await this.mailer.sendWithTemplate({
        recipient: {
          email: Email.getPrimary(organization.ownerUser.contacts)?.value.address ?? '',
        },
        template: {
          id: 'd-e2679264028841579b0eb21a65e0a9d0',
          data: {
            userId: user.id,
            userName: user.name,
            userEmail: Email.getPrimary(user.contacts)?.value.address ?? '',
            organizationName: organization.name,
            admissionProposalId,
          },
        },
      })
    } catch (error) {}
  }
}
