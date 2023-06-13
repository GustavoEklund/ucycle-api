import { OrderTypeOrmQuery } from '@/infra/query/postgres/order'

export const makeOrderTypeOrmQuery = (): OrderTypeOrmQuery => {
  return new OrderTypeOrmQuery()
}
