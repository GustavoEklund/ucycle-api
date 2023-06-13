import { Controller } from '@/application/controllers'
import { AddProductToShoppingCartController } from '@/application/controllers/shopping-cart'
import { makeAddProductToShoppingCartUseCase } from '@/main/factories/domain/use-cases/shopping-cart'

export const makeAddProductToShoppingCartController = (): Controller => {
  return new AddProductToShoppingCartController(makeAddProductToShoppingCartUseCase())
}
