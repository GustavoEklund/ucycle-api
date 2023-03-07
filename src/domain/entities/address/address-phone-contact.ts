import { ValueObject } from '@/domain/value-objects'

export class AddressPhoneContact extends ValueObject {
  private readonly _addressId: string
  private readonly _phoneContactId: string

  public constructor(input: { addressId: string; phoneContactId: string }) {
    super()
    this._addressId = input.addressId
    this._phoneContactId = input.phoneContactId
  }

  public get addressId(): string {
    return this._addressId
  }

  public get phoneContactId(): string {
    return this._phoneContactId
  }
}
