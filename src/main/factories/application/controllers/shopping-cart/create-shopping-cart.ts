import { Controller } from '@/application/controllers'
import { CreateShoppingCartController } from '@/application/controllers/shopping-cart'
import { makeCreateShoppingCartUseCase } from '@/main/factories/domain/use-cases/shopping-cart'

export const makeCreateShoppingCartController = (): Controller => {
  return new CreateShoppingCartController(makeCreateShoppingCartUseCase())
}
