import { RevokePermission } from '@/domain/use-cases/permissions'
import { Controller } from '@/application/controllers'
import { HttpResponse, noContent, notFound } from '@/application/helpers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { UserNotFoundError, UserPermissionNotFoundError } from '@/domain/entities/errors'

export type HttpRequest = {
  userId: string
  targetUserId: string
  permissionId: string
}

export class RevokePermissionController extends Controller {
  public constructor(private readonly revokePermission: RevokePermission) {
    super()
  }

  public async perform({
    userId,
    targetUserId,
    permissionId,
  }: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.revokePermission.perform({
      user: { id: userId },
      targetUser: {
        id: targetUserId,
        permission: { id: permissionId },
      },
    })
    if (output instanceof UserNotFoundError) return notFound([output])
    if (output instanceof UserPermissionNotFoundError) return notFound([output])
    return noContent()
  }

  public override buildValidators({
    userId,
    targetUserId,
    permissionId,
  }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: targetUserId, fieldName: 'targetUserId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: permissionId, fieldName: 'permissionId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
