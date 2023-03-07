import { ValueObject } from '@/domain/value-objects'
import { OrderItemAmountMustBeGreaterThanZeroError } from '@/domain/entities/errors/order'

export class OrderItem extends ValueObject {
  private readonly _productId: string
  private readonly priceInCents: number
  private readonly amount: number

  public constructor(input: { productId: string; priceInCents: number; amount: number }) {
    super()
    if (input.amount <= 0) throw new OrderItemAmountMustBeGreaterThanZeroError()
    this._productId = input.productId
    this.priceInCents = input.priceInCents
    this.amount = input.amount
  }

  public get productId(): string {
    return this._productId
  }

  public getTotal(): number {
    return this.priceInCents * this.amount
  }
}
