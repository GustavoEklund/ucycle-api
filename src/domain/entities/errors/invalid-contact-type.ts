import { Exception } from '@/domain/entities/errors'

export class InvalidContactTypeError extends Exception {
  public constructor() {
    super('InvalidContactTypeError', `invalid contact type`)
  }
}
