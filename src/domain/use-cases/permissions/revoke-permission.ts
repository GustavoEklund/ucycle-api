import { LoadUserAccount, LoadUserPermission, SaveUserPermission } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { UserPermissionNotFoundError } from '@/domain/entities/errors/permission'

export interface RevokePermission {
  perform: (input: RevokePermission.Input) => Promise<RevokePermission.Output>
}

export class RevokePermissionUseCase implements RevokePermission {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly userPermissionRepository: LoadUserPermission & SaveUserPermission
  ) {}

  public async perform(input: RevokePermission.Input): Promise<RevokePermission.Output> {
    const user = await this.userRepository.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    const targetUser = await this.userRepository.load({ id: input.targetUser.id })
    if (targetUser === undefined) return new UserNotFoundError(input.targetUser.id)
    const userPermission = await this.userPermissionRepository.load({
      id: input.targetUser.permission.id,
    })
    if (userPermission === undefined)
      return new UserPermissionNotFoundError(input.targetUser.permission.id)
    userPermission.revoke()
    await this.userPermissionRepository.save(userPermission)
  }
}

export namespace RevokePermission {
  export type Input = {
    user: {
      id: string
    }
    targetUser: {
      id: string
      permission: {
        id: string
      }
    }
  }
  export type Output = undefined | UserNotFoundError | UserPermissionNotFoundError
}
