import { Controller } from '@/application/controllers'
import { AddProductToShoppingCartController } from '@/application/controllers/shopping-cart'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'
import { makeAddProductToShoppingCartUseCase } from '@/main/factories/domain/use-cases/shopping-cart'

export const makeAddProductToShoppingCartController = (): Controller => {
  const controller = new AddProductToShoppingCartController(makeAddProductToShoppingCartUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
