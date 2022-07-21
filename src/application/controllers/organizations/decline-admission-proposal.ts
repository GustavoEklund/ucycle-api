import { DeclineAdmissionProposal } from '@/domain/use-cases'
import { UserNotFoundError } from '@/domain/entities/errors'
import { HttpResponse, notFound } from '@/application/helpers'

type HttpRequest = {
  userId: string
  admissionProposalId: string
}

export class DeclineAdmissionProposalController {
  public constructor(private readonly declineAdmissionProposal: DeclineAdmissionProposal) {}

  public async handle(input: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    await this.declineAdmissionProposal.perform({
      user: { id: input.userId },
      admissionProposal: { id: input.admissionProposalId },
    })
    return notFound([new UserNotFoundError(input.userId)])
  }
}
