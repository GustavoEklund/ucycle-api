import { LoadAdmissionProposal, LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'

export interface DeclineAdmissionProposal {
  perform: (input: DeclineAdmissionProposal.Input) => Promise<DeclineAdmissionProposal.Output>
}

export class DeclineAdmissionProposalUseCase {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly admissionProposalRepo: LoadAdmissionProposal
  ) {}

  public async perform(
    input: DeclineAdmissionProposal.Input
  ): Promise<DeclineAdmissionProposal.Output> {
    const user = await this.userRepo.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError('any_user_id')
    await this.admissionProposalRepo.load({ id: input.admissionProposal.id })
  }
}

export namespace DeclineAdmissionProposal {
  export type Input = {
    user: {
      id: string
    }
    admissionProposal: {
      id: string
    }
  }
  export type Output = undefined | UserNotFoundError
}
