import { ShoppingCart } from '@/domain/entities/shopping-cart'

export interface SaveShoppingCart {
  save: (input: ShoppingCart) => Promise<void>
}
