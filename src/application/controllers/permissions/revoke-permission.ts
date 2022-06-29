import { RevokePermission } from '@/domain/use-cases/permissions'
import { Controller } from '@/application/controllers'
import { HttpResponse, notFound, ok } from '@/application/helpers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { UserNotFoundError, UserPermissionNotFoundError } from '@/domain/entities/errors'

export type HttpRequest = {
  userId: string
  targetUser: {
    id: string
    permission: { id: string }
  }
}

export class RevokePermissionController extends Controller {
  public constructor(private readonly revokePermission: RevokePermission) {
    super()
  }

  public async perform({
    userId,
    targetUser,
  }: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.revokePermission.perform({ user: { id: userId }, targetUser })
    if (output instanceof UserNotFoundError) return notFound([output])
    if (output instanceof UserPermissionNotFoundError) return notFound([output])
    return ok(undefined)
  }

  public override buildValidators({ userId, targetUser }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: targetUser.id, fieldName: 'targetUser.id' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({
        value: targetUser.permission.id,
        fieldName: 'targetUser.permission.id',
      })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
