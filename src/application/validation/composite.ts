import { Validator } from '@/application/validation'

export class ValidationComposite implements Validator {
  public constructor(private readonly validators: Validator[]) {}

  public validate(): Error[] {
    const errors: Error[] = []
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) errors.push(...error)
    }
    return errors
  }
}
