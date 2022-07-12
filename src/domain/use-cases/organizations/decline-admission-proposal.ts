import { LoadAdmissionProposal, LoadUserAccount } from '@/domain/contracts/repos'
import { AdmissionProposalNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

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
    if (user === undefined) return new UserNotFoundError(input.user.id)
    await this.admissionProposalRepo.load({ id: input.admissionProposal.id })
    return new AdmissionProposalNotFoundError('any_admission_proposal_id')
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
  export type Output = undefined | UserNotFoundError | AdmissionProposalNotFoundError
}
