import { created, HttpResponse, notFound, ok } from '@/application/helpers'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'
import { UserAccountNotFoundError } from '@/domain/entities/errors'

import { GrantPermission } from '@/domain/use-cases/permissions'
import { Controller } from '../controller'

type HttpRequest = {
  grantById: string
  grantToId: string
  code: string
  read: boolean
  write: boolean
  owner: boolean
  status: string
  moduleId: string
  resourceId: string
}

export class GrantPermissionController extends Controller {
  public constructor(private readonly grantPermission: GrantPermission) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<{ id: string } | Error[]>> {
    const output = await this.grantPermission.perform(httpRequest)

    if (output instanceof UserAccountNotFoundError) return notFound([output])

    return ok(output)
  }

  public override buildValidators({
    grantById,
    grantToId,
    code,
    read,
    write,
    owner,
    status,
    moduleId,
    resourceId,
  }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: grantById, fieldName: 'grantById' })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ value: grantToId, fieldName: 'grantToId' })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ value: code, fieldName: 'code' }).required(RequiredType.string).build(),
      ...Builder.of({ value: read, fieldName: 'read' }).required(RequiredType.boolean).build(),
      ...Builder.of({ value: write, fieldName: 'write' }).required(RequiredType.boolean).build(),
      ...Builder.of({ value: owner, fieldName: 'owner' }).required(RequiredType.boolean).build(),
      ...Builder.of({ value: status, fieldName: 'status' }).required(RequiredType.string).build(),
      ...Builder.of({ value: moduleId, fieldName: 'moduleId' })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ value: resourceId, fieldName: 'resourceId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
