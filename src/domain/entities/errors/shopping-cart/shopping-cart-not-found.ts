import { Exception } from '@/domain/entities/errors'

export class ShoppingCartNotFoundError extends Exception {
  public constructor(id: string) {
    const message = `shopping cart with id ${id} not found`
    super('ShoppingCartNotFoundError', message)
  }
}
