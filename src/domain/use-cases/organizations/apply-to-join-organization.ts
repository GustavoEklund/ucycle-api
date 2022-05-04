import { LoadOrganization, LoadUserAccount } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'

export interface ApplyToJoinOrganization {
  perform: (input: ApplyToJoinOrganization.Input) => Promise<ApplyToJoinOrganization.Output>
}

export class ApplyToJoinOrganizationUseCase implements ApplyToJoinOrganization {
  public constructor(
    private readonly userAccountRepository: LoadUserAccount,
    private readonly organizationRepository: LoadOrganization
  ) {}

  public async perform({
    userId,
    organizationId,
  }: ApplyToJoinOrganization.Input): Promise<ApplyToJoinOrganization.Output> {
    const userAccount = await this.userAccountRepository.load({ id: userId })
    if (userAccount === undefined) {
      throw new UserAccountNotFoundError(userId)
    }
    const organization = await this.organizationRepository.load({ id: organizationId })
    if (organization === undefined) {
      throw new OrganizationNotFoundError(organizationId)
    }
  }
}

export namespace ApplyToJoinOrganization {
  export type Input = {
    userId: string
    organizationId: string
  }
  export type Output = void
}
