import {
  LoadProduct,
  LoadShoppingCart,
  LoadUserAccount,
  SaveShoppingCart,
} from '@/domain/contracts/repos'
import { ProductNotFoundError } from '@/domain/entities/errors/product'
import {
  ShoppingCartDoesNotBelongToUserError,
  ShoppingCartNotFoundError,
} from '@/domain/entities/errors/shopping-cart'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'

export interface AddProductToShoppingCart {
  perform: (input: AddProductToShoppingCart.Input) => Promise<AddProductToShoppingCart.Output>
}

export class AddProductToShoppingCartUseCase implements AddProductToShoppingCart {
  public constructor(
    private readonly productRepository: LoadProduct,
    private readonly userRepository: LoadUserAccount,
    private readonly shoppingCartRepository: LoadShoppingCart & SaveShoppingCart
  ) {}

  public async perform(
    input: AddProductToShoppingCart.Input
  ): Promise<AddProductToShoppingCart.Output> {
    const shoppingCart = await this.shoppingCartRepository.load({ id: input.shoppingCart.id })
    if (shoppingCart === undefined) return new ShoppingCartNotFoundError(input.shoppingCart.id)
    const product = await this.productRepository.load({ id: input.product.id })
    if (product === undefined) return new ProductNotFoundError(input.product.id)
    if (input.user.id !== undefined) {
      const user = await this.userRepository.load({ id: input.product.id })
      if (user === undefined) return new UserAccountNotFoundError(input.user.id)
      if (!shoppingCart.belongsToUser(user.id))
        return new ShoppingCartDoesNotBelongToUserError(shoppingCart.id, user.id)
    }
    shoppingCart.addProduct(product)
    await this.shoppingCartRepository.save(shoppingCart)
  }
}

export namespace AddProductToShoppingCart {
  export type Input = {
    product: {
      id: string
    }
    user: {
      id?: string
    }
    shoppingCart: {
      id: string
    }
  }
  export type Output =
    | undefined
    | ShoppingCartNotFoundError
    | ProductNotFoundError
    | UserAccountNotFoundError
    | ShoppingCartDoesNotBelongToUserError
}
