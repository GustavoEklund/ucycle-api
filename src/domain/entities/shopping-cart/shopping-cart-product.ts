import { ValueObject } from '@/domain/value-objects'

export class ShoppingCartProduct extends ValueObject {
  public readonly id: string
  public readonly title: string
  public readonly priceInCents: number
  public readonly amount: number

  public constructor(input: { id: string; title: string; priceInCents: number; amount: number }) {
    super()
    this.id = input.id
    this.title = input.title
    this.priceInCents = input.priceInCents
    this.amount = input.amount
  }

  public get totalPrinceInCents(): number {
    return this.priceInCents * this.amount
  }
}
