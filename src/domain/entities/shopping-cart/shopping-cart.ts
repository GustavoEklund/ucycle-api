import { Entity } from '@/domain/entities'
import { Product } from '../product'
import { ShoppingCartProduct } from './shopping-cart-product'

export class ShoppingCart extends Entity {
  private readonly _userId?: string

  public constructor(input: { id: string; userId?: string }) {
    super({ id: input.id })
    this._userId = input.userId
    this._products = []
  }

  public _products: ShoppingCartProduct[]

  public get products(): ShoppingCartProduct[] {
    return this._products
  }

  public get userId(): string | undefined {
    return this._userId
  }

  public belongsToUser(userId: string): boolean {
    return this._userId === userId
  }

  public addProduct(product: Product, amount = 1): void {
    const existingProductIndex = this._products.findIndex(
      (existingProduct) => existingProduct.id === product.id
    )
    if (existingProductIndex !== -1) {
      this._products[existingProductIndex].increaseAmount(amount)
      return
    }
    const shoppingCartProduct = new ShoppingCartProduct({
      id: product.id,
      title: product.title,
      priceInCents: product.price.totalInCents,
      amount: amount,
      pictureUrl: product.pictureUrls[0],
    })
    this._products.push(shoppingCartProduct)
  }

  public containsProduct(id: string): boolean {
    const product = this._products.find((product) => product.id === id)
    return product !== undefined
  }
}
