import { ValueObject } from '@/domain/value-objects'

export class ShoppingCartProduct extends ValueObject {
  public readonly id: string
  public readonly title: string
  public readonly priceInCents: number
  public readonly pictureUrl: string

  public constructor(input: {
    id: string
    title: string
    priceInCents: number
    amount: number
    pictureUrl: string
  }) {
    super()
    this.id = input.id
    this.title = input.title
    this.priceInCents = input.priceInCents
    this._amount = input.amount
    this.pictureUrl = input.pictureUrl
  }

  private _amount: number

  public get amount(): number {
    return this._amount
  }

  public get totalPrinceInCents(): number {
    return this.priceInCents * this._amount
  }

  public increaseAmount(amount = 1): void {
    this._amount = this._amount + amount
  }
}
