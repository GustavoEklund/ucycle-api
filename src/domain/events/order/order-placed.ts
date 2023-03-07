import { DomainEvent } from '@/domain/events'
import { Order } from '@/domain/entities/order'

export class OrderPlacedEvent extends DomainEvent {
  public readonly order: Order

  public constructor(input: { order: Order; when?: Date }) {
    super({ name: 'ORDER_PLACED', when: input.when })
    this.order = input.order
  }
}
