import { Order } from '@/domain/entities/order'

export interface SaveOrder {
  save: (order: Order) => Promise<void>
}

export interface LoadOrder {
  load: (input: LoadOrder.Input) => Promise<Order>
}

export namespace LoadOrder {
  export type Input = {
    code: string
  }
}
