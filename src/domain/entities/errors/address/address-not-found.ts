import { DomainException } from '@/domain/entities/errors'

export class AddressNotFoundError extends DomainException {
  public constructor(id?: string) {
    const message = id ? `address with id ${id} not found` : 'address not found'
    super('AddressNotFoundError', message)
  }
}
