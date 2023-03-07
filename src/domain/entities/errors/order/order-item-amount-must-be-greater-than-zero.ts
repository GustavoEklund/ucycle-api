import { DomainException } from '@/domain/entities/errors'

export class OrderItemAmountMustBeGreaterThanZeroError extends DomainException {
  public constructor() {
    const message = 'order item amount must be greater than zero'
    super('OrderItemAmountMustBeGreatherThanZeroError', message)
  }
}
