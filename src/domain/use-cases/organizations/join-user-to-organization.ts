import { Observer } from '@/domain/events'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

interface JoinUserToOrganization {
  perform: (input: JoinUserToOrganization.Input) => Promise<JoinUserToOrganization.Output>
}

export class JoinUserToOrganizationUseCase extends Observer implements JoinUserToOrganization {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly organizationRepository: LoadOrganization & SaveOrganization,
    private readonly currentDate: Date
  ) {
    super({ domainEvents: ['ADMISSION_PROPOSAL_ACCEPTED'] })
  }

  public async handle(input: AdmissionProposalAccepted): Promise<JoinUserToOrganization.Output> {
    const user = await this.userRepository.load({ id: input.admissionProposal.userId })
    if (user === undefined) return new UserNotFoundError(input.acceptedByUser.id)
    const organization = await this.organizationRepository.load({
      id: input.admissionProposal.organizationId,
    })
    if (organization === undefined)
      return new OrganizationNotFoundError(input.admissionProposal.organizationId)
    organization.joinMember({
      userId: user.id,
      admissionProposalId: input.admissionProposal.id,
      date: this.currentDate,
    })
    await this.organizationRepository.save(organization)
  }

  public async perform(
    input: JoinUserToOrganization.Input
  ): Promise<JoinUserToOrganization.Output> {
    return this.handle(input)
  }
}

namespace JoinUserToOrganization {
  export type Input = AdmissionProposalAccepted
  export type Output = undefined | UserNotFoundError
}
