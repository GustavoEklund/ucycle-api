import { LoadUserAccount } from '@/domain/contracts/repos'

export interface DeclineAdmissionProposal {
  perform: (input: DeclineAdmissionProposal.Input) => Promise<DeclineAdmissionProposal.Output>
}

export class DeclineAdmissionProposalUseCase {
  public constructor(private readonly userRepo: LoadUserAccount) {}

  public async perform(input: DeclineAdmissionProposal.Input): Promise<void> {
    await this.userRepo.load({ id: input.user.id })
  }
}

export namespace DeclineAdmissionProposal {
  export type Input = {
    user: {
      id: string
    }
  }
  export type Output = void
}
