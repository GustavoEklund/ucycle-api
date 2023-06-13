import { ValueObject } from '@/domain/value-objects'
import { ProductWarrantyDuration, ProductWarrantyType } from '@/domain/entities/product'

export class ProductWarranty extends ValueObject {
  private readonly _duration: ProductWarrantyDuration
  private readonly _type: ProductWarrantyType

  public constructor(input: { duration: ProductWarrantyDuration; type: ProductWarrantyType }) {
    super()
    this._duration = input.duration
    this._type = input.type
  }

  public get duration(): ProductWarrantyDuration {
    return this._duration
  }

  public get type(): ProductWarrantyType {
    return this._type
  }
}
