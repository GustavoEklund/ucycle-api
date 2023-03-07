import { ValueObject } from '@/domain/value-objects'

export class Coupon extends ValueObject {
  private readonly code: string
  private readonly percentage: number
  private readonly expireDate: Date

  public constructor(input: { code: string; percentage: number; expireDate: Date }) {
    super()
    this.code = input.code
    this.percentage = input.percentage
    this.expireDate = input.expireDate
  }

  public isExpired(referenceDate: Date): boolean {
    return this.expireDate.getTime() < referenceDate.getTime()
  }

  public getDiscount(total: number): number {
    return (total * this.percentage) / 100
  }
}
