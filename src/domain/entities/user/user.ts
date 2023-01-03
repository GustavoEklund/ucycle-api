import { Entity } from '@/domain/entities'
import { UserAccount, UserProfile } from '@/domain/entities/user'

export class User extends Entity {
  public readonly account: UserAccount
  public readonly profile: UserProfile

  public constructor({
    id,
    account,
    profile,
  }: {
    id: string
    account: UserAccount
    profile: UserProfile
  }) {
    super({ id })
    this.account = account
    this.profile = profile
  }

  public assignNewId(id: string): void {
    this._id = id
  }
}
