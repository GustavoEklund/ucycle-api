import { LoadUserAccount } from '@/domain/contracts/repos'
import { UserAccountNotFoundError } from '@/domain/entities/errors'

export interface ApplyToJoinOrganization {
  perform: (input: ApplyToJoinOrganization.Input) => Promise<ApplyToJoinOrganization.Output>
}

export class ApplyToJoinOrganizationUseCase implements ApplyToJoinOrganization {
  public constructor(private readonly userAccountRepository: LoadUserAccount) {}

  public async perform({
    userId,
  }: ApplyToJoinOrganization.Input): Promise<ApplyToJoinOrganization.Output> {
    const userAccount = await this.userAccountRepository.load({ id: userId })
    if (userAccount === undefined) {
      throw new UserAccountNotFoundError(userId)
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
