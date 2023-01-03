import { InvalidNameError } from '@/domain/entities/errors/user'
import { ValueObject } from '@/domain/value-objects/value-object'

export enum NameType {
  primary = 'primary',
  birth = 'birth',
  nickname = 'nickname',
}

export class Name extends ValueObject {
  public readonly first: string
  public readonly last: string
  public readonly type: NameType
  private readonly _value: string

  public constructor({ value }: { value: string }) {
    super()
    if (!Name.isValid(value)) throw new InvalidNameError(value)
    this._value = value
    this.first = Name.getFirstName(value)
    this.last = Name.getLastName(value)
    this.type = NameType.primary
  }

  public get value(): string {
    return this._value
  }

  private static isValid(name: string): boolean {
    return name.length > 7 && name.length < 257 && name.split(' ').length > 1
  }

  private static getFirstName(name: string): string {
    return name.split(' ')[0]
  }

  private static getLastName(name: string): string {
    return name.split(' ').slice(1).join(' ')
  }
}
