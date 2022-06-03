import { LoadUserAccount } from '@/domain/contracts/repos'
import { UserAccountNotFoundError } from '@/domain/entities/errors'

export interface GrantPermission {
  perform: (input: GrantPermission.Input) => Promise<GrantPermission.Output>
}

export class GrantPermissionUseCase implements GrantPermission {
  public constructor(private readonly userRepo: LoadUserAccount) {}

  public async perform({ userId }: GrantPermission.Input): Promise<GrantPermission.Output> {
    const user = await this.userRepo.load({ id: userId })
    if (user === undefined) throw new UserAccountNotFoundError(userId)
  }
}

export namespace GrantPermission {
  export type Input = {
    userId: string
  }
  export type Output = void
}
