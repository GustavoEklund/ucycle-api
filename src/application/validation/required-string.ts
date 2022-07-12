import { RequiredFieldError } from '@/application/errors'
import { Required } from '@/application/validation/required'

export class RequiredString extends Required {
  constructor(override readonly value: string, override readonly fieldName?: string) {
    super(value, fieldName)
  }

  public override validate(): Error[] {
    const errors = super.validate()
    if (this.value === '') errors.push(new RequiredFieldError(this.fieldName))
    return errors
  }
}
