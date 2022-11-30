import { LoadProductDetailsController } from '@/application/controllers/products/load-product'
import { makeLoadProductDetailsUseCase } from '@/main/factories/domain/use-cases/products'

export const makeLoadProductController = () => {
  return new LoadProductDetailsController(makeLoadProductDetailsUseCase())
}
