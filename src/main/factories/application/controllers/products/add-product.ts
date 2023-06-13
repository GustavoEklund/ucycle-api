import { Controller } from '@/application/controllers'
import { AddProductController } from '@/application/controllers/products'
import { makeAddProductUseCase } from '@/main/factories/domain/use-cases/products'

export const makeAddProductController = (): Controller => {
  return new AddProductController(makeAddProductUseCase())
}
