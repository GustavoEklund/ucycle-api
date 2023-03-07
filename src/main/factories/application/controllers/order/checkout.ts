import { Controller } from '@/application/controllers'
import { CheckoutController } from '@/application/controllers/order'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'
import { makeCheckoutUseCase } from '@/main/factories/domain/use-cases/order'

export const makeCheckoutController = (): Controller => {
  const controller = new CheckoutController(makeCheckoutUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
