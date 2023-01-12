import { ShoppingCart } from '@/domain/entities/shopping-cart'

export interface SaveShoppingCart {
  save: (input: ShoppingCart) => Promise<void>
}

export interface LoadShoppingCart {
  load: (input: LoadShoppingCart.Input) => Promise<LoadShoppingCart.Output>
}

export namespace LoadShoppingCart {
  export type Input = {
    id: string
  }
  export type Output = ShoppingCart | undefined
}
