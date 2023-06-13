import { Controller } from '@/application/controllers'
import { CheckoutController } from '@/application/controllers/order'
import { makeCheckoutUseCase } from '@/main/factories/domain/use-cases/order'

export const makeCheckoutController = (): Controller => {
  return new CheckoutController(makeCheckoutUseCase())
}
