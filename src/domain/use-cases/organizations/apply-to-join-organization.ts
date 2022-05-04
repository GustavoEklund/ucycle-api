import { LoadOrganization, LoadUserAccount, SaveAdmissionProposal } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'

export interface ApplyToJoinOrganization {
  perform: (input: ApplyToJoinOrganization.Input) => Promise<ApplyToJoinOrganization.Output>
}

export class ApplyToJoinOrganizationUseCase implements ApplyToJoinOrganization {
  public constructor(
    private readonly userAccountRepo: LoadUserAccount,
    private readonly organizationRepo: LoadOrganization,
    private readonly admissionProposalRepo: SaveAdmissionProposal
  ) {}

  public async perform({
    userId,
    organizationId,
  }: ApplyToJoinOrganization.Input): Promise<ApplyToJoinOrganization.Output> {
    const userAccount = await this.userAccountRepo.load({ id: userId })
    if (userAccount === undefined) {
      throw new UserAccountNotFoundError(userId)
    }
    const organization = await this.organizationRepo.load({ id: organizationId })
    if (organization === undefined) {
      throw new OrganizationNotFoundError(organizationId)
    }
    await this.admissionProposalRepo.save({
      userId,
      organizationId,
    })
  }
}

export namespace ApplyToJoinOrganization {
  export type Input = {
    userId: string
    organizationId: string
  }
  export type Output = void
}
