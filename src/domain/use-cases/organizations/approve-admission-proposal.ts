import { LoadAdmissionProposal, LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'

export interface ApproveAdmissionProposal {
  perform: (input: ApproveAdmissionProposal.Input) => Promise<ApproveAdmissionProposal.Output>
}

export class ApproveAdmissionProposalUseCase implements ApproveAdmissionProposal {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly admissionProposalRepo: LoadAdmissionProposal
  ) {}

  public async perform(
    input: ApproveAdmissionProposal.Input
  ): Promise<ApproveAdmissionProposal.Output> {
    const user = await this.userRepo.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    await this.admissionProposalRepo.load({ id: input.admissionProposal.id })
  }
}

export namespace ApproveAdmissionProposal {
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
