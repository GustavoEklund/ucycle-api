import { LoadUserAccount } from '@/domain/contracts/repos'

interface ApproveAdmissionProposal {
  perform: (input: ApproveAdmissionProposal.Input) => Promise<ApproveAdmissionProposal.Output>
}

export class ApproveAdmissionProposalUseCase implements ApproveAdmissionProposal {
  public constructor(private readonly userRepo: LoadUserAccount) {}

  public async perform({
    user,
  }: ApproveAdmissionProposal.Input): Promise<ApproveAdmissionProposal.Output> {
    await this.userRepo.load({ id: user.id })
  }
}

namespace ApproveAdmissionProposal {
  export type Input = {
    user: {
      id: string
    }
  }
  export type Output = void
}
