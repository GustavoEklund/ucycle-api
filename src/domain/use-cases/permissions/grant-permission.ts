import { LoadBasePermission, LoadUserAccount, SaveUserPermission } from '@/domain/contracts/repos'
import { BasePermissionNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'
import { Publisher } from '@/domain/events'
import { UserPermission } from '@/domain/entities/permission'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { PermissionGranted } from '@/domain/events/permission'

export interface GrantPermission {
  perform: (input: GrantPermission.Input) => Promise<GrantPermission.Output>
}

export class GrantPermissionUseCase extends Publisher implements GrantPermission {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly basePermissionRepo: LoadBasePermission,
    private readonly userPermissionRepo: SaveUserPermission,
    private readonly crypto: UUIDGenerator
  ) {
    super()
  }

  public async perform({
    grantById,
    code,
    grantToId,
    read,
    owner,
    write,
    moduleId,
    organizationId,
  }: GrantPermission.Input): Promise<GrantPermission.Output> {
    const user = await this.userRepo.load({ id: grantById })
    if (user === undefined) return new UserAccountNotFoundError(grantById)
    const targetUser = await this.userRepo.load({ id: grantToId })
    if (targetUser === undefined) return new UserAccountNotFoundError(grantToId)
    const basePermission = await this.basePermissionRepo.load({ code: code })
    if (basePermission === undefined) return new BasePermissionNotFoundError(code)
    const userPermissionId = this.crypto.uuid()
    const userPermission = new UserPermission({
      id: userPermissionId,
      grantByUserId: grantById,
      grantToUserId: grantToId,
      grantAtOrganizationId: organizationId,
      code,
      write,
      read,
      owner,
      moduleId,
      name: basePermission.name,
      description: basePermission.description,
      expiration: basePermission.expiration,
    })
    await this.userPermissionRepo.save(userPermission)
    const event = new PermissionGranted({
      permission: userPermission,
      grantTo: targetUser,
    })
    await this.notify(event)
    return { id: userPermissionId }
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
    moduleId: string
    organizationId: string
  }
  export type Output = { id: string } | UserAccountNotFoundError | BasePermissionNotFoundError
}
