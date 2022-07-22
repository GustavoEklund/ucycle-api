import { Exception } from '@/domain/entities/errors'

export class InvalidPhoneError extends Exception {
  public constructor() {
    super('InvalidPhoneError', `invalid phone`)
  }
}
