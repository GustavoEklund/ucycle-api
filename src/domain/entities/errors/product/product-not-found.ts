import { Exception } from '@/domain/entities/errors'

export class ProductNotFoundError extends Exception {
  public constructor(id: string) {
    const message = `product with id ${id} not found`
    super('ProductNotFoundError', message)
  }
}
