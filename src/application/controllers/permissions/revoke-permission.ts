import { RevokePermission } from '@/domain/use-cases/permissions'

type HttpRequest = {
  user: { id: string }
  targetUser: {
    id: string
    permission: { id: string }
  }
}

export class RevokePermissionController {
  public constructor(private readonly revokePermission: RevokePermission) {}

  public async perform({ user, targetUser }: HttpRequest): Promise<void> {
    await this.revokePermission.perform({ user, targetUser })
  }
}
