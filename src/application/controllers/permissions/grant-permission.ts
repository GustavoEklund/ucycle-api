import { HttpResponse, notFound, ok } from '@/application/helpers'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'
import { BasePermissionNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'

import { GrantPermission } from '@/domain/use-cases/permissions'
import { Controller } from '../controller'

type HttpRequest = {
  userId: string
  targetUserId: string
  code: string
  read: boolean
  write: boolean
  owner: boolean
  moduleId: string
  organizationId: string
}

export class GrantPermissionController extends Controller {
  public constructor(private readonly grantPermission: GrantPermission) {
    super()
  }

  public async perform({
    code,
    read,
    write,
    owner,
    userId,
    targetUserId,
    moduleId,
    organizationId,
  }: HttpRequest): Promise<HttpResponse<{ id: string } | Error[]>> {
    const output = await this.grantPermission.perform({
      code,
      read,
      write,
      owner,
      grantById: userId,
      grantToId: targetUserId,
      moduleId,
      organizationId,
    })
    if (output instanceof UserAccountNotFoundError) return notFound([output])
    if (output instanceof BasePermissionNotFoundError) return notFound([output])
    return ok(output)
  }

  public override buildValidators({
    code,
    read,
    write,
    owner,
    userId,
    targetUserId,
    moduleId,
    organizationId,
  }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: userId, fieldName: 'userId' }).required(RequiredType.string).build(),
      ...Builder.of({ value: targetUserId, fieldName: 'targetUserId' })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ value: code, fieldName: 'code' }).required(RequiredType.string).build(),
      ...Builder.of({ value: read, fieldName: 'read' }).required(RequiredType.boolean).build(),
      ...Builder.of({ value: write, fieldName: 'write' }).required(RequiredType.boolean).build(),
      ...Builder.of({ value: owner, fieldName: 'owner' }).required(RequiredType.boolean).build(),
      ...Builder.of({ value: moduleId, fieldName: 'moduleId' })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ value: organizationId, fieldName: 'organizationId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
