import { UpdateOrganization } from '@/domain/use-cases/organizations'
import { forbidden, HttpResponse, notFound, ok } from '@/application/helpers'
import { Controller } from '../controller'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'
import {
  OrganizationNotFoundError,
  UnauthorizedUserError,
  UserNotFoundError,
} from '@/domain/entities/errors'

type HttpRequest = {
  updateOrganizationInfo: UpdateOrganization.Input
}

export class UpdateOrganizationController extends Controller {
  public constructor(private readonly updateOrganization: UpdateOrganization) {
    super()
  }

  public async perform({
    updateOrganizationInfo,
  }: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const response = await this.updateOrganization.perform(updateOrganizationInfo)
    if (response instanceof OrganizationNotFoundError) return notFound([response])
    if (response instanceof UserNotFoundError) return notFound([response])
    if (response instanceof UnauthorizedUserError) return forbidden()
    return ok(response)
  }

  public override buildValidators({ updateOrganizationInfo }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ fieldName: 'userId', value: updateOrganizationInfo.user.id })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'organizationId', value: updateOrganizationInfo.organization.id })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({
        fieldName: 'organizationName',
        value: updateOrganizationInfo.organization.name,
      })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({
        fieldName: 'organizationDescription',
        value: updateOrganizationInfo.organization.description,
      })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
