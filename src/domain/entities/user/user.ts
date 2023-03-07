import { Entity } from '@/domain/entities'
import { UserAccount, UserAddress, UserProfile } from '@/domain/entities/user'

export class User extends Entity {
  public readonly account: UserAccount
  public readonly profile: UserProfile
  public readonly addresses: UserAddress[]

  public constructor({
    id,
    account,
    profile,
    addresses,
  }: {
    id: string
    account: UserAccount
    profile: UserProfile
    addresses?: { id: string }[]
  }) {
    super({ id })
    this.account = account
    this.profile = profile
    this.addresses =
      addresses === undefined
        ? []
        : addresses?.map((address) => {
            return new UserAddress({ userId: this.id, addressId: address.id })
          })
  }

  public assignNewId(id: string): void {
    this._id = id
  }

  public addAddress(address: { id: string }): void {
    const userAddress = new UserAddress({ userId: this.id, addressId: address.id })
    this.addresses.push(userAddress)
  }
}
