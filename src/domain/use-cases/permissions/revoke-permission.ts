import { LoadUserAccount, LoadUserPermission } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'

export interface RevokePermission {
  perform: (input: RevokePermission.Input) => Promise<RevokePermission.Output>
}

export class RevokePermissionUseCase implements RevokePermission {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly userPermissionRepository: LoadUserPermission
  ) {}

  public async perform(input: RevokePermission.Input): Promise<RevokePermission.Output> {
    const user = await this.userRepository.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    const targetUser = await this.userRepository.load({ id: input.targetUser.id })
    if (targetUser === undefined) return new UserNotFoundError(input.targetUser.id)
    await this.userPermissionRepository.load({ id: input.targetUser.permission.id })
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
  export type Output = undefined | UserNotFoundError
}
