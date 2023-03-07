import { Order } from '@/domain/entities/order'

export interface SaveOrder {
  save: (order: Order) => Promise<void>
}
