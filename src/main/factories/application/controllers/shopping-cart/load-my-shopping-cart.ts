import { Controller } from '@/application/controllers'
import { LoadMyShoppingCartController } from '@/application/controllers/shopping-cart'
import { makeLoadMyShoppingCartUseCase } from '@/main/factories/domain/use-cases/shopping-cart'

export const makeLoadMyShoppingCartController = (): Controller => {
  return new LoadMyShoppingCartController(makeLoadMyShoppingCartUseCase())
}
