import { Entity } from '@/domain/entities'
import { Product } from '@/domain/entities/product'
import { Coupon, OrderItem, OrderStatus } from '@/domain/entities/order'

export class Order extends Entity {
  private readonly _items: OrderItem[]
  private readonly coupons: Coupon[]
  private readonly _shippingAddressId: string
  private readonly _freight: number
  private readonly _userId: string
  private _status: OrderStatus

  public constructor(input: {
    id: string
    shippingAddressId: string
    userId: string
    freight?: number
    status: OrderStatus
  }) {
    super({ id: input.id })
    this._items = []
    this.coupons = []
    this._freight = input.freight ?? 0
    this._shippingAddressId = input.shippingAddressId
    this._userId = input.userId
    this._status = input.status
  }

  public get items(): OrderItem[] {
    return this._items
  }

  public get freight(): number {
    return this._freight
  }

  public get shippingAddressId(): string {
    return this._shippingAddressId
  }

  public get userId(): string {
    return this._userId
  }

  public get status(): OrderStatus {
    return this._status
  }

  public set status(status: OrderStatus) {
    this._status = status
  }

  public pay(): void {
    this._status = OrderStatus.PAYMENT_PENDING
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

  public getTotalInCents(): number {
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
