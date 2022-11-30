import { ValueObject } from '@/domain/value-objects'

export class Price extends ValueObject {
  private readonly _totalInCents: number
  private readonly _discountInPercentage: number

  public constructor(input: { totalInCents: number; discountInPercentage: number }) {
    super()
    this._totalInCents = input.totalInCents
    this._discountInPercentage = input.discountInPercentage
  }

  public get totalInCents(): number {
    return this._totalInCents
  }

  public get discountInPercentage(): number {
    return this._discountInPercentage
  }

  public get discount(): number {
    return this._totalInCents * this._discountInPercentage
  }
}
