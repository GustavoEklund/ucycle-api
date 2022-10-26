import { LoadProductsController } from '@/application/controllers/products'
import { makeLoadProductsUseCase } from '@/main/factories/domain/use-cases/products'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators/log-error-controller'
import { Controller } from '@/application/controllers'

export const makeLoadProductsController = (): Controller => {
  const controller = new LoadProductsController(makeLoadProductsUseCase())
  return makeLogErrorControllerDecorator(controller)
}
