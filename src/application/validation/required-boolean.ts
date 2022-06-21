import { RequiredFieldError } from '../errors'
import { Required } from './required'

export class RequiredBoolean extends Required {
  public override validate(): Error[] {
    if (typeof this.value !== 'boolean') return [new RequiredFieldError(this.fieldName)]
    return []
  }
}
