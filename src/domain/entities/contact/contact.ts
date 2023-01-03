import { ValueObject } from '@/domain/value-objects'

type ContactValue = any

export abstract class Contact extends ValueObject {
  public readonly value: ContactValue
  private readonly _userId: string

  protected constructor(
    public readonly type: string,
    public readonly label: string,
    verified: boolean,
    public readonly isPrivate: boolean,
    userId: string
  ) {
    super()
    this._verified = verified
    this._userId = userId
  }

  private _verified: boolean

  public get verified(): boolean {
    return this._verified
  }

  public get userId(): string {
    return this._userId
  }

  private static getFlattenValueFromValue(value: any): any {
    return JSON.stringify(value)
  }

  public verify(): void {
    this._verified = true
  }

  public isValueEqualsToRawValue(rawValue: string): boolean {
    const inputValue = this.getValueFromRawValue(rawValue)
    const flattenInputValue = Contact.getFlattenValueFromValue(inputValue)
    const flattenSelfValue = Contact.getFlattenValueFromValue(this.value)
    return flattenInputValue === flattenSelfValue
  }

  public abstract getValueFromRawValue(value: string): ContactValue

  public abstract getFormattedValue(): string

  public abstract getFullPlainValue(): string
}
