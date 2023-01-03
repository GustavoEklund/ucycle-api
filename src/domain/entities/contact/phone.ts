import { Contact } from '@/domain/entities/contact'
import { InvalidPhoneError } from '@/domain/entities/errors/contact'

export enum PhoneType {
  primary = 'PRIMARY',
  whatsapp = 'WHATSAPP',
}

export type PhoneNumber = {
  countryCode: string
  areaCode: string
  number: string
}

export class Phone extends Contact {
  public override readonly value: PhoneNumber

  public constructor(input: {
    value: string
    label: PhoneType
    verified: boolean
    isPrivate: boolean
    userId: string
  }) {
    super('PHONE', input.label, input.verified, input.isPrivate, input.userId)
    if (!Phone.isValid(input.value)) throw new InvalidPhoneError(input.value)
    this.value = Phone.getValueFromRawValue(input.value)
  }

  public static isPhoneInstance(contact: any): contact is Phone {
    return contact instanceof Phone
  }

  public static getValueFromRawValue(value: string): PhoneNumber {
    const clearNumber = Phone.removeNonNumbers(value)
    return {
      countryCode: Phone.extractCountryCode(clearNumber),
      areaCode: Phone.extractAreaCode(clearNumber),
      number: Phone.extractNumber(clearNumber),
    }
  }

  public static isValid(phone: string): boolean {
    const clearNumber = Phone.removeNonNumbers(phone)
    return clearNumber.length >= 12 && clearNumber.length <= 13
  }

  public static isPhoneType(type: string): type is PhoneType {
    return Object.values(PhoneType).includes(type as PhoneType)
  }

  public static removeNonNumbers(number: string): string {
    return number.replace(/\D/g, '')
  }

  private static extractCountryCode(fullClearNumber: string): string {
    return fullClearNumber.substring(0, 2)
  }

  private static extractAreaCode(fullClearNumber: string): string {
    return fullClearNumber.substring(2, 4)
  }

  private static extractNumber(fullClearNumber: string): string {
    return fullClearNumber.substring(4)
  }

  public getValueFromRawValue(value: string): PhoneNumber {
    return Phone.getValueFromRawValue(value)
  }

  public getFormattedValue(): string {
    const regex = /^(\d{2})(\d{2})(\d{4}|\d{5})(\d{4})$/
    const match = Phone.removeNonNumbers(this.getFullPlainValue()).match(regex)
    if (match === null) throw new Error('failed to format number')
    const countryCode = match[1]
    const areaCode = match[2]
    const number = `${match[3]}-${match[4]}`
    return `+${countryCode} (${areaCode}) ${number}`
  }

  public getFullPlainValue(): string {
    return `+${this.value.countryCode}${this.value.areaCode}${this.value.number}`
  }
}
