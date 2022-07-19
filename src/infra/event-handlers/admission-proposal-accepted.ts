import { Observer } from '@/domain/events'
import { Mailer } from '@/domain/contracts/gateways'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { LoadOrganization, LoadUserAccount } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

export class AdmissionProposalAcceptedHandler extends Observer {
  public constructor(
    private readonly mailer: Mailer,
    private readonly userRepository: LoadUserAccount,
    private readonly organizationRepository: LoadOrganization
  ) {
    super({ domainEvents: ['ADMISSION_PROPOSAL_ACCEPTED'] })
  }

  public async handle({ admissionProposal }: AdmissionProposalAccepted): Promise<void> {
    const user = await this.userRepository.load({ id: admissionProposal.userId })
    if (user === undefined) throw new UserNotFoundError(admissionProposal.userId)
    const organization = await this.organizationRepository.load({
      id: admissionProposal.organizationId,
    })
    if (organization === undefined)
      throw new OrganizationNotFoundError(admissionProposal.organizationId)
    await this.mailer.sendWithTemplate({
      recipient: {
        name: user.account.name.value,
        email: user.account.getPrimaryEmail().value.address,
      },
      template: {
        id: 'd-edc111240ab4437388a38c9003298462',
        data: {
          organizationName: organization.name,
        },
      },
    })
  }
}
