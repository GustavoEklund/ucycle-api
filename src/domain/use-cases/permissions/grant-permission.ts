import { LoadUserAccount } from '@/domain/contracts/repos'

export interface GrantPermission {
  perform: (input: GrantPermission.Input) => Promise<GrantPermission.Output>
}

export class GrantPermissionUseCase implements GrantPermission {
  public constructor(private readonly userRepo: LoadUserAccount) {}

  public async perform({ userId }: GrantPermission.Input): Promise<GrantPermission.Output> {
    await this.userRepo.load({ id: userId })
  }
}

export namespace GrantPermission {
  export type Input = {
    userId: string
  }
  export type Output = void
}
