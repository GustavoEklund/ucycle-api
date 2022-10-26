import { ProductQuery } from '@/infra/query/postgres'

export const makeProductQuery = (): ProductQuery => {
  return new ProductQuery()
}
