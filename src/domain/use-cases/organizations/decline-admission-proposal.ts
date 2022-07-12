import { LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'

export interface DeclineAdmissionProposal {
  perform: (input: DeclineAdmissionProposal.Input) => Promise<DeclineAdmissionProposal.Output>
}

export class DeclineAdmissionProposalUseCase {
  public constructor(private readonly userRepo: LoadUserAccount) {}

  public async perform(
    input: DeclineAdmissionProposal.Input
  ): Promise<DeclineAdmissionProposal.Output> {
    await this.userRepo.load({ id: input.user.id })
    return new UserNotFoundError('any_user_id')
  }
}

export namespace DeclineAdmissionProposal {
  export type Input = {
    user: {
      id: string
    }
  }
  export type Output = undefined | UserNotFoundError
}
