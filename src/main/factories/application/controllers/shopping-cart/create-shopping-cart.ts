import { Controller } from '@/application/controllers'
import { CreateShoppingCartController } from '@/application/controllers/shopping-cart'
import { makeCreateShoppingCartUseCase } from '@/main/factories/domain/use-cases/shopping-cart'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'

export const makeCreateShoppingCartController = (): Controller => {
  const controller = new CreateShoppingCartController(makeCreateShoppingCartUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
