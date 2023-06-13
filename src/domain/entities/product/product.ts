import { Entity } from '@/domain/entities'
import {
  ProductCondition,
  Price,
  ProductWarranty,
  ProductWarrantyDurationUnit,
  ProductWarrantyType,
} from '@/domain/entities/product'

export class Product extends Entity {
  private readonly _sellerId: string
  private readonly _categoryId: string
  private readonly _title: string
  private readonly _description: string
  private readonly _pictureUrls: string[]
  private readonly _price: Price
  private readonly _warranty: ProductWarranty
  private readonly _condition: ProductCondition

  public constructor(input: {
    id: string
    sellerId: string
    categoryId: string
    title: string
    description: string
    pictureUrls: string[]
    price: {
      totalInCents: number
      discountInPercentage: number
    }
    warranty: {
      duration: {
        time: number
        unit: ProductWarrantyDurationUnit
      }
      type: ProductWarrantyType
    }
    condition: ProductCondition
  }) {
    super({ id: input.id })
    this._sellerId = input.sellerId
    this._categoryId = input.categoryId
    this._title = input.title
    this._description = input.description
    this._pictureUrls = input.pictureUrls
    this._price = new Price(input.price)
    this._warranty = new ProductWarranty(input.warranty)
    this._condition = input.condition
  }

  public get sellerId(): string {
    return this._sellerId
  }

  public get categoryId(): string {
    return this._categoryId
  }

  public get title(): string {
    return this._title
  }

  public get description(): string {
    return this._description
  }

  public get pictureUrls(): string[] {
    return this._pictureUrls
  }

  public get price(): Price {
    return this._price
  }

  public get warranty(): ProductWarranty {
    return this._warranty
  }

  public get condition(): ProductCondition {
    return this._condition
  }
}
