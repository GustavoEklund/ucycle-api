import { LoadBasePermission, LoadUserAccount, SavePermission } from '@/domain/contracts/repos'
import { BasePermissionNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'

export interface GrantPermission {
  perform: (input: GrantPermission.Input) => Promise<GrantPermission.Output>
}

export class GrantPermissionUseCase implements GrantPermission {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly basePermissionRepo: LoadBasePermission,
    private readonly permissionRepo: SavePermission
  ) {}

  public async perform(input: GrantPermission.Input): Promise<GrantPermission.Output> {
    const user = await this.userRepo.load({ id: input.grantById })
    if (user === undefined) return new UserAccountNotFoundError(input.grantById)
    const targetUser = await this.userRepo.load({ id: input.grantToId })
    if (targetUser === undefined) return new UserAccountNotFoundError(input.grantToId)
    const basePermission = await this.basePermissionRepo.load({ code: input.code })
    if (basePermission === undefined) return new BasePermissionNotFoundError(input.code)
    const { id: permissionId } = await this.permissionRepo.save(input)
    return { id: permissionId }
  }
}

export namespace GrantPermission {
  export type Input = {
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
  export type Output = { id: string } | UserAccountNotFoundError
}
