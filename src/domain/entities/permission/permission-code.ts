import { ValueObject } from '@/domain/value-objects'
import { InvalidPermissionCodeError } from '@/domain/entities/errors/permission'

export class PermissionCode extends ValueObject {
  public readonly value: string

  public constructor({ value }: { value: string }) {
    super()
    if (!PermissionCode.isValid(value)) throw new InvalidPermissionCodeError(value)
    this.value = value
  }

  private static isValid(code: string): boolean {
    const hasOnlyUppercaseLettersNumbersAndUnderscores = /^[A-Z\d_]+$/.test(code)
    const hasOnlyNumbers = /^\d+$/.test(code)
    const hasOnlyUnderscores = /^_+$/.test(code)
    const beginsWithNumber = /^\d/.test(code)
    const beginsWithUnderscore = /^_/.test(code)
    return (
      code.length >= 3 &&
      code.length <= 100 &&
      hasOnlyUppercaseLettersNumbersAndUnderscores &&
      !hasOnlyNumbers &&
      !hasOnlyUnderscores &&
      !beginsWithNumber &&
      !beginsWithUnderscore
    )
  }
}
