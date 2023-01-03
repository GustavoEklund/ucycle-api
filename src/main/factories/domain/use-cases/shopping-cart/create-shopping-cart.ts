import { CreateShoppingCart, CreateShoppingCartUseCase } from '@/domain/use-cases/shopping-cart'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import { makePgShoppingCartRepository } from '@/main/factories/infra/repos/postgres'

export const makeCreateShoppingCartUseCase = (): CreateShoppingCart => {
  return new CreateShoppingCartUseCase(makeUuidHandler(), makePgShoppingCartRepository())
}
