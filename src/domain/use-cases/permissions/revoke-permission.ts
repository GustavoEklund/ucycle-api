import { LoadUserAccount } from '@/domain/contracts/repos'

export interface RevokePermission {
  perform: (input: RevokePermission.Input) => Promise<RevokePermission.Output>
}

export class RevokePermissionUseCase implements RevokePermission {
  public constructor(private readonly userRepository: LoadUserAccount) {}

  public async perform(input: RevokePermission.Input): Promise<RevokePermission.Output> {
    await this.userRepository.load({ id: input.user.id })
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
  export type Output = void
}
