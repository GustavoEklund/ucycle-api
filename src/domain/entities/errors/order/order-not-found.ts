import { DomainException } from '@/domain/entities/errors'

export class OrderNotFoundError extends DomainException {
  public constructor(code: string) {
    super('OrderNotFoundError', `order with code ${code} not found`)
  }
}
