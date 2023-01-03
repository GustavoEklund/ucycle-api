import { Observer } from '@/domain/events'
import { Mailer } from '@/domain/contracts/gateways'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { LoadOrganization, LoadUserAccount } from '@/domain/contracts/repos'
import { JoinUserToOrganization } from '@/domain/use-cases'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { OrganizationNotFoundError } from '@/domain/entities/errors/organization'

export class AdmissionProposalAcceptedHandler extends Observer {
  public constructor(
    private readonly joinUserToOrganizationUseCase: JoinUserToOrganization,
    private readonly mailer: Mailer,
    private readonly userRepository: LoadUserAccount,
    private readonly organizationRepository: LoadOrganization
  ) {
    super({ domainEvents: ['ADMISSION_PROPOSAL_ACCEPTED'] })
  }

  public async handle({ admissionProposal }: AdmissionProposalAccepted): Promise<void> {
    const output = await this.joinUserToOrganizationUseCase.perform({
      admissionProposal: {
        id: admissionProposal.id,
        organization: { id: admissionProposal.organizationId },
        user: { id: admissionProposal.userId },
      },
    })
    if (output instanceof UserNotFoundError) throw output
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
        code: 'ADMISSION_PROPOSAL_ACCEPTED',
        data: {
          organizationName: organization.name,
        },
      },
    })
  }
}
