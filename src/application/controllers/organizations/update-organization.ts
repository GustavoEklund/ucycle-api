import { UpdateOrganization } from '@/domain/use-cases/organizations'
import { forbidden, HttpResponse, notFound, ok } from '@/application/helpers'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'
import { UnauthorizedUserError } from '@/domain/entities/errors/permission'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { OrganizationNotFoundError } from '@/domain/entities/errors/organization'
import { Controller } from '@/application/controllers'

type Organization = {
  name: string
  description: string
}

type HttpRequest = {
  userId: string
  organizationId: string
  organization: Organization
}

export class UpdateOrganizationController extends Controller {
  public constructor(private readonly updateOrganization: UpdateOrganization) {
    super()
  }

  public async perform({
    userId,
    organizationId,
    organization,
  }: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const response = await this.updateOrganization.perform({
      user: {
        id: userId,
      },
      organization: {
        description: organization.description,
        id: organizationId,
        name: organization.name,
      },
    })
    if (response instanceof OrganizationNotFoundError) return notFound([response])
    if (response instanceof UserNotFoundError) return notFound([response])
    if (response instanceof UnauthorizedUserError) return forbidden()
    return ok(response)
  }

  public override buildValidators({
    userId,
    organizationId,
    organization,
  }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ fieldName: 'userId', value: userId }).required(RequiredType.string).build(),
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
