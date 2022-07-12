import { RequiredFieldError } from '@/application/errors'
import { Validator } from '@/application/validation/validator'

export class Required implements Validator {
  public constructor(protected readonly value: any, protected readonly fieldName?: string) {}

  public validate(): Error[] {
    if (this.value === null || this.value === undefined) {
      return [new RequiredFieldError(this.fieldName)]
    }
    return []
  }
}
