import { DomainException } from '@/domain/entities/errors'

export class OrderMustHaveAtLeastOneItemError extends DomainException {
  public constructor() {
    const message = 'the order must have at least one item'
    super('OrderMustHaveAtLeastOneItemError', message)
  }
}
