import { RevokePermission } from '@/domain/use-cases/permissions'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'

type HttpRequest = {
  user: { id: string }
  targetUser: {
    id: string
    permission: { id: string }
  }
}

export class RevokePermissionController extends Controller {
  public constructor(private readonly revokePermission: RevokePermission) {
    super()
  }

  public async perform({ user, targetUser }: HttpRequest): Promise<HttpResponse<undefined>> {
    await this.revokePermission.perform({ user, targetUser })
    return ok(undefined)
  }
}
