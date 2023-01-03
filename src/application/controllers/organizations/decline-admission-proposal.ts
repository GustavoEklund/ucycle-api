import { DeclineAdmissionProposal } from '@/domain/use-cases'
import { HttpResponse } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { UnauthorizedUserError } from '@/domain/entities/errors/permission'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { AdmissionProposalNotFoundError } from '@/domain/entities/errors/organization'

type HttpRequest = {
  userId: string
  admissionProposalId: string
}

export class DeclineAdmissionProposalController extends Controller {
  public constructor(private readonly declineAdmissionProposal: DeclineAdmissionProposal) {
    super()
  }

  public async perform(input: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.declineAdmissionProposal.perform({
      user: { id: input.userId },
      admissionProposal: { id: input.admissionProposalId },
    })
    if (output instanceof UserNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof AdmissionProposalNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof UnauthorizedUserError) return HttpResponse.forbidden([output])
    return HttpResponse.ok(undefined)
  }

  public override buildValidators({ userId, admissionProposalId }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: admissionProposalId, fieldName: 'admissionProposalId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
