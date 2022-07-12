import { Exception } from '@/domain/entities/errors/exception'

export class ContactNotFoundError extends Exception {
  public constructor(value?: string) {
    const message = value ? `contact with value ${value} not found` : 'contact not found'
    super('ContactNotFoundError', message)
  }
}
