import { Exception } from '@/domain/entities/errors'

export class InvalidEmailError extends Exception {
  public constructor() {
    super('InvalidEmailError', `invalid email`)
  }
}
