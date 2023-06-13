import { ProductCategoryQuery } from '@/infra/query/postgres'

export const makeProductCategoryQuery = (): ProductCategoryQuery => {
  return new ProductCategoryQuery()
}
