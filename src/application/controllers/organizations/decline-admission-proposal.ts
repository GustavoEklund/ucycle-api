import { DeclineAdmissionProposal } from '@/domain/use-cases'

type HttpRequest = {
  userId: string
  admissionProposalId: string
}

export class DeclineAdmissionProposalController {
  public constructor(private readonly declineAdmissionProposal: DeclineAdmissionProposal) {}

  public async handle(input: HttpRequest): Promise<void> {
    await this.declineAdmissionProposal.perform({
      user: { id: input.userId },
      admissionProposal: { id: input.admissionProposalId },
    })
  }
}
