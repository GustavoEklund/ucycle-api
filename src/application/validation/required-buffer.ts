import { RequiredFieldError } from '@/application/errors'
import { Required } from '@/application/validation/required'

export class RequiredBuffer extends Required {
  public constructor(override readonly value: Buffer, override readonly fieldName?: string) {
    super(value, fieldName)
  }

  public override validate(): Error[] {
    const errors = super.validate()
    if (this.value.length === 0) errors.push(new RequiredFieldError(this.fieldName))
    return errors
  }
}
