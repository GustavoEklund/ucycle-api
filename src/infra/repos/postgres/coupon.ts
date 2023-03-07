import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadCoupon } from '@/domain/contracts/repos'
import { PgCoupon } from '@/infra/repos/postgres/entities'
import { Coupon } from '@/domain/entities/order'

export class PgCouponRepository extends PgRepository implements LoadCoupon {
  public async load(input: LoadCoupon.Input): Promise<LoadCoupon.Output> {
    const pgCoupon = await this.getRepository(PgCoupon).findOne({
      where: { code: input.code },
    })
    if (pgCoupon === undefined) return undefined
    return new Coupon({
      code: pgCoupon.code,
      expireDate: pgCoupon.expireDate,
      percentage: pgCoupon.percentage,
    })
  }
}
