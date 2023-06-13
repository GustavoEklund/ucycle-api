import { AddressType } from '@/domain/entities/address'
import { OrderStatus } from '@/domain/entities/order'

type ShippingAddress = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  neighbourhood: string
  buildingNumber: string | undefined
  landmark: string | undefined
  type: AddressType
  phoneContact:
    | {
        id: string
        value: string
      }
    | undefined
}

type Shipping = {
  id: string
  priceInCents: number
  estimatedDeliveryDate: Date
  address: ShippingAddress
}

type OrderItem = {
  id: string
  title: string
  pictureUrl: string
  priceInCents: number
  amount: number
}

type Order = {
  code: string
  createdAt: Date
  updatedAt: Date
  status: OrderStatus
  totalInCents: number
  shipping: Shipping
  items: OrderItem[]
}

export interface LoadMyOrdersQuery {
  loadMyOrders: (input: LoadMyOrdersQuery.Input) => Promise<LoadMyOrdersQuery.Output>
}

export namespace LoadMyOrdersQuery {
  export type Input = {
    user: {
      id: string
    }
    page: {
      number: number
      size: number
    }
  }
  export type Output = Order[]
}

export interface LoadMySalesQuery {
  loadMySales: (input: LoadMySalesQuery.Input) => Promise<LoadMySalesQuery.Output>
}

export namespace LoadMySalesQuery {
  export type Input = {
    seller: {
      id: string
    }
    page: {
      number: number
      size: number
    }
  }
  export type Output = Order[]
}
