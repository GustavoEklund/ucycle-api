import { Controller } from '@/application/controllers'
import { LoadMyShoppingCartController } from '@/application/controllers/shopping-cart'
import { makeLoadMyShoppingCartUseCase } from '@/main/factories/domain/use-cases/shopping-cart'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'

export const makeLoadMyShoppingCartController = (): Controller => {
  const controller = new LoadMyShoppingCartController(makeLoadMyShoppingCartUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
