import { Entity } from '@/domain/entities'
import { Price } from '@/domain/entities/product'

export class Product extends Entity {
  private readonly _title: string
  private readonly _description: string
  private readonly _pictureUrl: string
  private readonly _price: Price

  public constructor(input: {
    id: string
    title: string
    description: string
    pictureUrl: string
    price: {
      totalInCents: number
      discountInPercentage: number
    }
  }) {
    super({ id: input.id })
    this._title = input.title
    this._description = input.description
    this._pictureUrl = input.pictureUrl
    this._price = new Price(input.price)
  }

  public get title(): string {
    return this._title
  }

  public get description(): string {
    return this._description
  }

  public get pictureUrl(): string {
    return this._pictureUrl
  }

  public get price(): Price {
    return this._price
  }
}
