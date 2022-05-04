import { InvalidFieldError, RequiredFieldError } from '@/application/errors'
import { Required } from '@/application/validation/required'

export class RequiredInteger extends Required {
  constructor(override readonly value: any, override readonly fieldName?: string) {
    super(value, fieldName)
  }

  override validate(): Error | undefined {
    if (super.validate() !== undefined) {
      return new RequiredFieldError(this.fieldName)
    }
    if (!Number.isInteger(Number(this.value))) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}
