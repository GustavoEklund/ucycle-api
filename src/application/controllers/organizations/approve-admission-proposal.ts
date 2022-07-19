import { Controller } from '@/application/controllers'
import { HttpResponse, notFound, ok } from '@/application/helpers'
import { ApproveAdmissionProposal } from '@/domain/use-cases'
import { AdmissionProposalNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  userId: string
  admissionProposalId: string
}

export class ApproveAdmissionProposalController extends Controller {
  public constructor(private readonly approveAdmissionProposal: ApproveAdmissionProposal) {
    super()
  }

  public override async perform({
    userId,
    admissionProposalId,
  }: HttpRequest): Promise<HttpResponse<Error[] | undefined>> {
    const output = await this.approveAdmissionProposal.perform({
      user: { id: userId },
      admissionProposal: { id: admissionProposalId },
    })
    if (output instanceof UserNotFoundError) return notFound([output])
    if (output instanceof AdmissionProposalNotFoundError) return notFound([output])
    return ok(output)
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
