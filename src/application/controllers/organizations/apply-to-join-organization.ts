import { ApplyToJoinOrganization } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { conflict, created, HttpResponse, notFound } from '@/application/helpers'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'
import {
  AlreadyAppliedToJoinOrganizationError,
  AlreadyMemberOfOrganizationError,
  OrganizationNotFoundError,
  TheOrganizationOwnerCanNotApplyToJoinOrganizationError,
} from '@/domain/entities/errors/organization'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'

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
  }: HttpRequest): Promise<HttpResponse<Error[] | undefined>> {
    try {
      await this.applyToJoinOrganization.perform({ userId, organizationId })
    } catch (error) {
      if (error instanceof UserAccountNotFoundError) return notFound([error])
      if (error instanceof OrganizationNotFoundError) return notFound([error])
      if (error instanceof AlreadyAppliedToJoinOrganizationError) return conflict([error])
      if (error instanceof AlreadyMemberOfOrganizationError) return conflict([error])
      if (error instanceof TheOrganizationOwnerCanNotApplyToJoinOrganizationError)
        return conflict([error])
      throw error
    }
    return created(undefined)
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
