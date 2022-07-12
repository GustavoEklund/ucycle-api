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
  userId: string
  organizationId: string
  organization: Organization
}

type Organization = {
  name: string
  description: string
}

export class UpdateOrganizationController extends Controller {
  public constructor(private readonly updateOrganization: UpdateOrganization) {
    super()
  }

  public async perform({
    userId,
    organizationId,
    organization

  }: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const response = await this.updateOrganization.perform({
      user: {
        id: userId
      },
      organization: {
        description: organization.description,
        id: organizationId,
        name: organization.name
      }
    })
    if (response instanceof OrganizationNotFoundError) return notFound([response])
    if (response instanceof UserNotFoundError) return notFound([response])
    if (response instanceof UnauthorizedUserError) return forbidden()
    return ok(response)
  }

  public override buildValidators({
    userId,
    organizationId,
    organization
 }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ fieldName: 'userId', value: userId })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'organizationId', value: organizationId })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({
        fieldName: 'organization.name',
        value: organization.name,
      })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({
        fieldName: 'organization.description',
        value: organization.description,
      })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
