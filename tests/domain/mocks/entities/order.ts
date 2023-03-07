import { Order } from '@/domain/entities/order'
import { faker } from '@faker-js/faker'

export const mockOrder = (input?: {
  id?: string
  shippingAddressId?: string
  userId?: string
}): Order =>
  new Order({
    id: input?.id ?? faker.datatype.uuid(),
    shippingAddressId: input?.shippingAddressId ?? faker.datatype.uuid(),
    userId: input?.userId ?? faker.datatype.uuid(),
  })
