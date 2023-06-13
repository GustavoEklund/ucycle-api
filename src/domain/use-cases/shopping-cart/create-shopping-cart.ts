import { UUIDGenerator } from '@/domain/contracts/gateways'
import { SaveShoppingCart } from '@/domain/contracts/repos'
import { ShoppingCart } from '@/domain/entities/shopping-cart'

export interface CreateShoppingCart {
  perform: (input: CreateShoppingCart.Input) => Promise<CreateShoppingCart.Output>
}

export class CreateShoppingCartUseCase implements CreateShoppingCart {
  public constructor(
    private readonly crypto: UUIDGenerator,
    private readonly shoppingCartRepository: SaveShoppingCart
  ) {}

  public async perform(input: CreateShoppingCart.Input): Promise<CreateShoppingCart.Output> {
    const shoppingCartId = this.crypto.uuid()
    const shoppingCart = new ShoppingCart({
      id: shoppingCartId,
      userId: input.user.id,
    })
    await this.shoppingCartRepository.save(shoppingCart)
    return { id: shoppingCart.id }
  }
}

export namespace CreateShoppingCart {
  export type Input = {
    user: { id?: string }
  }
  export type Output = {
    id: string
  }
}
