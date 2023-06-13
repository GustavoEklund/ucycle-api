import { ValueObject } from '@/domain/value-objects'
import { OrderItemAmountMustBeGreaterThanZeroError } from '@/domain/entities/errors/order'

export class OrderItem extends ValueObject {
  private readonly _productId: string
  private readonly _priceInCents: number
  private readonly _amount: number

  public constructor(input: { productId: string; priceInCents: number; amount: number }) {
    super()
    if (input.amount <= 0) throw new OrderItemAmountMustBeGreaterThanZeroError()
    this._productId = input.productId
    this._priceInCents = input.priceInCents
    this._amount = input.amount
  }

  public get productId(): string {
    return this._productId
  }

  public get priceInCents(): number {
    return this._priceInCents
  }

  public get amount(): number {
    return this._amount
  }

  public getTotal(): number {
    return this._priceInCents * this._amount
  }
}
