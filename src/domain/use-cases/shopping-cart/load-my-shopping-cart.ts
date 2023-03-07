import { LoadShoppingCart } from '@/domain/contracts/repos'
import { ShoppingCartNotFoundError } from '@/domain/entities/errors/shopping-cart'
import { ShoppingCart } from '@/domain/entities/shopping-cart'

export interface LoadMyShoppingCart {
  perform: (input: LoadMyShoppingCart.Input) => Promise<LoadMyShoppingCart.Output>
}

export class LoadMyShoppingCartUseCase implements LoadMyShoppingCart {
  public constructor(private readonly shoppingCartRepository: LoadShoppingCart) {}

  public async perform(input: LoadMyShoppingCart.Input): Promise<LoadMyShoppingCart.Output> {
    let shoppingCart: ShoppingCart | undefined
    if (input.user.id !== undefined) {
      shoppingCart = await this.shoppingCartRepository.load({ userId: input.user.id })
    }
    if (input.shoppingCart.id !== undefined) {
      shoppingCart = await this.shoppingCartRepository.load({ id: input.shoppingCart.id })
    }
    if (shoppingCart === undefined)
      return new ShoppingCartNotFoundError(input.shoppingCart.id ?? '(no id provided)')
    return {
      id: shoppingCart.id,
      products: shoppingCart.products.map((shoppingCartProduct) => {
        return {
          id: shoppingCartProduct.id,
          title: shoppingCartProduct.title,
          priceInCents: shoppingCartProduct.priceInCents,
          amount: shoppingCartProduct.amount,
        }
      }),
    }
  }
}

export namespace LoadMyShoppingCart {
  export type Input = {
    user: { id: string | undefined }
    shoppingCart: { id: string | undefined }
  }
  export type Output =
    | {
        id: string
        products: {
          id: string
          title: string
          priceInCents: number
          amount: number
        }[]
      }
    | ShoppingCartNotFoundError
}
