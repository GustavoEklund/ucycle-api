import { Exception } from '@/domain/entities/errors'

export class ContactAlreadyExistsError extends Exception {
  public constructor(contactValue: string) {
    super('ContactAlreadyExistsError', `Contact ${contactValue} already exists`)
  }
}
