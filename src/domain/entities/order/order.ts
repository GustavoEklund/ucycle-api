import { Entity } from '@/domain/entities'
import { Product } from '@/domain/entities/product'
import { Coupon, OrderItem } from '@/domain/entities/order'

export class Order extends Entity {
  private readonly _items: OrderItem[]
  private readonly coupons: Coupon[]
  private readonly _shippingAddressId: string
  private readonly _freight: number
  private readonly userId: string

  public constructor(input: { id: string; shippingAddressId: string; userId: string }) {
    super({ id: input.id })
    this._items = []
    this.coupons = []
    this._freight = 0
    this._shippingAddressId = input.shippingAddressId
    this.userId = input.userId
  }

  public get items(): OrderItem[] {
    return this._items
  }

  public get freight(): number {
    return this._freight
  }

  public addItem(product: Product, amount: number): void {
    const productAlreadyExistsInOrder = this._items.some((item) => item.productId === product.id)
    if (productAlreadyExistsInOrder) return
    const orderItem = new OrderItem({
      productId: product.id,
      priceInCents: product.price.totalInCents,
      amount,
    })
    this._items.push(orderItem)
  }

  public addCoupon(coupon: Coupon, currentDate: Date): void {
    if (!coupon.isExpired(currentDate)) {
      this.coupons.push(coupon)
    }
  }

  public getTotal(): number {
    let total = 0
    for (const item of this._items) {
      total += item.getTotal()
    }
    if (this.coupons.length > 0) {
      for (const coupon of this.coupons) {
        total -= coupon.getDiscount(total)
      }
    }
    total += this._freight
    return total
  }
}
