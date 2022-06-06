import { LoadUserAccount } from '@/domain/contracts/repos'
import { UserAccountNotFoundError } from '@/domain/entities/errors'

export interface GrantPermission {
  perform: (input: GrantPermission.Input) => Promise<GrantPermission.Output>
}

export class GrantPermissionUseCase implements GrantPermission {
  public constructor(private readonly userRepo: LoadUserAccount) {}

  public async perform({
    userId,
    targetUserId,
  }: GrantPermission.Input): Promise<GrantPermission.Output> {
    const user = await this.userRepo.load({ id: userId })
    if (user === undefined) return new UserAccountNotFoundError(userId)
    const targetUser = await this.userRepo.load({ id: targetUserId })
    if (targetUser === undefined) return new UserAccountNotFoundError(targetUserId)
  }
}

export namespace GrantPermission {
  export type Input = {
    userId: string
    targetUserId: string
  }
  export type Output = undefined | UserAccountNotFoundError
}
