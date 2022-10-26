import { LoadProducts, LoadProductsUseCase } from '@/domain/use-cases/products'
import { makeProductQuery } from '@/main/factories/infra/query/postgres'

export const makeLoadProductsUseCase = (): LoadProducts => {
  return new LoadProductsUseCase(makeProductQuery())
}
