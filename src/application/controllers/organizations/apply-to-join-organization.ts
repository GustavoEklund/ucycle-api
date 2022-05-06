import { ApplyToJoinOrganization } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'

type HttpRequest = {
  userId: string
  organizationId: string
}

export class ApplyToJoinOrganizationController extends Controller {
  public constructor(private readonly applyToJoinOrganization: ApplyToJoinOrganization) {
    super()
  }

  public override async perform({
    userId,
    organizationId,
  }: HttpRequest): Promise<HttpResponse<string>> {
    await this.applyToJoinOrganization.perform({ userId, organizationId })
    return ok('')
  }

  public override buildValidators({ userId, organizationId }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: userId, fieldName: 'userId' }).required(RequiredType.string).build(),
      ...Builder.of({ value: organizationId, fieldName: 'organizationId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
