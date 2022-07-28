import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

export interface JoinUserToOrganization {
  perform: (input: JoinUserToOrganization.Input) => Promise<JoinUserToOrganization.Output>
}

export class JoinUserToOrganizationUseCase implements JoinUserToOrganization {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly organizationRepository: LoadOrganization & SaveOrganization,
    private readonly currentDate: Date
  ) {}

  public async perform({
    admissionProposal,
  }: JoinUserToOrganization.Input): Promise<JoinUserToOrganization.Output> {
    const user = await this.userRepository.load({ id: admissionProposal.user.id })
    if (user === undefined) return new UserNotFoundError(admissionProposal.user.id)
    const organization = await this.organizationRepository.load({
      id: admissionProposal.organization.id,
    })
    if (organization === undefined)
      return new OrganizationNotFoundError(admissionProposal.organization.id)
    organization.joinMember({
      userId: user.id,
      admissionProposalId: admissionProposal.id,
      date: this.currentDate,
    })
    await this.organizationRepository.save(organization)
  }
}

export namespace JoinUserToOrganization {
  export type Input = {
    admissionProposal: {
      id: string
      organization: { id: string }
      user: { id: string }
    }
  }
  export type Output = undefined | UserNotFoundError
}
