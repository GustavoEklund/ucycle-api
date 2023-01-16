import { LoadMyShoppingCart, LoadMyShoppingCartUseCase } from '@/domain/use-cases/shopping-cart'
import { makePgShoppingCartRepository } from '@/main/factories/infra/repos/postgres'

export const makeLoadMyShoppingCartUseCase = (): LoadMyShoppingCart => {
  return new LoadMyShoppingCartUseCase(makePgShoppingCartRepository())
}
