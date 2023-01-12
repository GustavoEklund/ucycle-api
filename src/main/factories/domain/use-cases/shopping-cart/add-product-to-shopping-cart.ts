import {
  AddProductToShoppingCart,
  AddProductToShoppingCartUseCase,
} from '@/domain/use-cases/shopping-cart'
import {
  makePgProductRepo,
  makePgShoppingCartRepository,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeAddProductToShoppingCartUseCase = (): AddProductToShoppingCart => {
  return new AddProductToShoppingCartUseCase(
    makePgProductRepo(),
    makePgUserAccountRepo(),
    makePgShoppingCartRepository()
  )
}
