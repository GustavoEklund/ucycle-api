import { Entity } from '@/domain/entities'
import { AddressPhoneContact, AddressType } from '@/domain/entities/address'

export class Address extends Entity {
  private readonly _street: string
  private readonly _city: string
  private readonly _state: string
  private readonly _zipCode: string
  private readonly _country: string
  private readonly _neighbourhood: string
  private readonly _buildingNumber: string | undefined
  private readonly _landmark: string | undefined
  private readonly _phoneContact?: AddressPhoneContact
  private readonly _type: AddressType
  private readonly _userId: string

  public constructor(input: {
    id: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    neighbourhood: string
    buildingNumber?: string
    phoneContactId?: string
    landmark?: string
    type: AddressType
    isDefault?: boolean
    userId: string
  }) {
    super({ id: input.id })
    this._street = input.street
    this._city = input.city
    this._state = input.state
    this._zipCode = Address.removeNonNumbers(input.zipCode)
    this._country = input.country
    this._neighbourhood = input.neighbourhood
    this._buildingNumber = input.buildingNumber
    this._phoneContact = input.phoneContactId
      ? new AddressPhoneContact({
          addressId: this.id,
          phoneContactId: input.phoneContactId,
        })
      : undefined
    this._landmark = input.landmark
    this._type = input.type
    this._isDefault = input.isDefault === undefined ? false : input.isDefault
    this._userId = input.userId
  }

  private _isDefault: boolean

  public get isDefault(): boolean {
    return this._isDefault
  }

  public get street(): string {
    return this._street
  }

  public get city(): string {
    return this._city
  }

  public get state(): string {
    return this._state
  }

  public get zipCode(): string {
    return this._zipCode
  }

  public get country(): string {
    return this._country
  }

  public get neighbourhood(): string {
    return this._neighbourhood
  }

  public get buildingNumber(): string | undefined {
    return this._buildingNumber
  }

  public get landmark(): string | undefined {
    return this._landmark
  }

  public get phoneContact(): AddressPhoneContact | undefined {
    return this._phoneContact
  }

  public get type(): AddressType {
    return this._type
  }

  public get userId(): string {
    return this._userId
  }

  private static removeNonNumbers(number: string): string {
    return number.replace(/\D/g, '')
  }

  public setAsDefault(): void {
    this._isDefault = true
  }

  public setAsNotDefault(): void {
    this._isDefault = false
  }

  public belongsToUser(userId: string): boolean {
    return this._userId === userId
  }
}
