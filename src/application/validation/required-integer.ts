import { InvalidFieldError } from '@/application/errors'
import { Required } from '@/application/validation/required'

export class RequiredInteger extends Required {
  public constructor(override readonly value: any, override readonly fieldName?: string) {
    super(value, fieldName)
  }

  public override validate(): Error[] {
    const errors = super.validate()
    if (!Number.isInteger(Number(this.value))) errors.push(new InvalidFieldError(this.fieldName))
    return errors
  }
}
