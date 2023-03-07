import { DomainException } from '@/domain/entities/errors'

export class AddressDoesNotBelongToUserError extends DomainException {
  public constructor(addressId: string, userId: string) {
    const message = `address ${addressId} does not belong to user with id ${userId}`
    super('AddressDoesNotBelongToUserError', message)
  }
}
