import { Contact } from '@/domain/value-objects/contact'

export enum PhoneType {
  primary = 'PRIMARY',
  whatsapp = 'WHATSAPP',
}

export class Phone extends Contact {
  public override readonly value: {
    countryCode: string
    areaCode: string
    number: string
  }

  public constructor(number: string, label: PhoneType) {
    super('PHONE', label, false, true)
    const clearNumber = Phone.removeNonNumbers(number)
    this.value = {
      countryCode: Phone.getCountryCode(clearNumber),
      areaCode: Phone.getAreaCode(clearNumber),
      number: Phone.getNumber(clearNumber),
    }
  }

  private static removeNonNumbers(number: string): string {
    return number.replace(/\D/g, '')
  }

  private static getCountryCode(number: string): string {
    const fullNumberLength = 13
    if (number.length >= fullNumberLength) return number.substring(0, 2)
    return '55'
  }

  private static getAreaCode(number: string): string {
    const fullNumberLength = 13
    if (number.length >= fullNumberLength) return number.substring(2, 4)
    const numberWithoutAreaCodeLength = 9
    if (number.length <= numberWithoutAreaCodeLength) return ''
    return number.substring(0, 2)
  }

  private static getNumber(number: string): string {
    const fullNumberLength = 13
    if (number.length >= fullNumberLength) return number.substring(4)
    const numberWithoutAreaCodeLength = 9
    if (number.length <= numberWithoutAreaCodeLength) return number
    return number.substring(2)
  }
}
