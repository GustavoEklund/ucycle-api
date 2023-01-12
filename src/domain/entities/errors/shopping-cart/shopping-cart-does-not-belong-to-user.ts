import { DomainException } from '@/domain/entities/errors'

export class ShoppingCartDoesNotBelongToUserError extends DomainException {
  public constructor(shoppingCartId: string, userId: string) {
    const message = `shopping cart ${shoppingCartId} does not belong to user with id ${userId}`
    super('ShoppingCartDoesNotBelongToUserError', message)
  }
}
