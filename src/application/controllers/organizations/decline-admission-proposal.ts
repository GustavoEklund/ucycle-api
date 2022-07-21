import { DeclineAdmissionProposal } from '@/domain/use-cases'
import {
  AdmissionProposalNotFoundError,
  UnauthorizedUserError,
  UserNotFoundError,
} from '@/domain/entities/errors'
import { HttpResponse } from '@/application/helpers'

type HttpRequest = {
  userId: string
  admissionProposalId: string
}

export class DeclineAdmissionProposalController {
  public constructor(private readonly declineAdmissionProposal: DeclineAdmissionProposal) {}

  public async handle(input: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.declineAdmissionProposal.perform({
      user: { id: input.userId },
      admissionProposal: { id: input.admissionProposalId },
    })
    if (output instanceof UserNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof AdmissionProposalNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof UnauthorizedUserError) return HttpResponse.forbidden([output])
    return HttpResponse.ok(undefined)
  }
}
