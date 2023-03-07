import { ValueObject } from '@/domain/value-objects'

export class UserAddress extends ValueObject {
  public readonly userId: string
  public readonly addressId: string

  public constructor(input: { userId: string; addressId: string }) {
    super()
    this.userId = input.userId
    this.addressId = input.addressId
  }
}
