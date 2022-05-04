import { LoadUserAccount } from '@/domain/contracts/repos'

export interface ApplyToJoinOrganization {
  perform: (input: ApplyToJoinOrganization.Input) => Promise<ApplyToJoinOrganization.Output>
}

export class ApplyToJoinOrganizationUseCase implements ApplyToJoinOrganization {
  public constructor(private readonly userAccountRepository: LoadUserAccount) {}

  public async perform({
    userId,
  }: ApplyToJoinOrganization.Input): Promise<ApplyToJoinOrganization.Output> {
    await this.userAccountRepository.load({ id: userId })
  }
}

export namespace ApplyToJoinOrganization {
  export type Input = {
    userId: string
    organizationId: string
  }
  export type Output = void
}
