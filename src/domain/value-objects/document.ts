import { InvalidDocumentError } from '@/domain/entities/errors/user'

export enum DocumentType {
  cpf = 'CPF',
  cnpj = 'CNPJ',
}

export class Document {
  public readonly type: DocumentType
  public readonly number: string

  public constructor(number: string) {
    const cleanNumber = Document.removeNonNumbers(number)
    const isValid = Document.isValid(cleanNumber)
    const type = Document.getType(cleanNumber)
    if (!isValid || type === undefined) throw new InvalidDocumentError()
    this.number = cleanNumber
    this.type = type
  }

  public static removeNonNumbers(number: string): string {
    return number.replace(/\D/g, '')
  }

  private static isValid(number: string): boolean {
    return Document.isCpf(number) || Document.isCnpj(number)
  }

  private static getType(number: string): DocumentType | undefined {
    if (Document.isCpf(number)) return DocumentType.cpf
    if (Document.isCnpj(number)) return DocumentType.cnpj
    return undefined
  }

  private static isCpf(number: string): boolean {
    number = Document.removeNonNumbers(number)
    if (
      number.length !== 11 ||
      number === '01234567890' ||
      new RegExp('^' + number[0] + '{11}$').test(number)
    )
      return false
    let n = 0
    for (let s = 10, i = 0; s >= 2; ++i, --s) n += Number(number[i]) * s
    if (Number(number[9]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false
    n = 0
    for (let s = 11, i = 0; s >= 2; ++i, --s) n += Number(number[i]) * s
    const check = (n %= 11) < 2 ? 0 : 11 - n
    return Number(number[10]) === check
  }

  private static isCnpj(number: string): boolean {
    const basis = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    number = Document.removeNonNumbers(number)
    if (number.length !== 14 || number === '00000000000000') return false
    let n = 0
    for (let i = 0; i < 12; ++i) n += Number(number[i]) * basis[i + 1]
    if (Number(number[12]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false
    n = 0
    for (let i = 0; i <= 12; ++i) n += Number(number[i]) * basis[i]
    const check = (n %= 11) < 2 ? 0 : 11 - n
    return Number(number[13]) === check
  }
}
