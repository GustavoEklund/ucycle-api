import { PgCouponRepository } from '@/infra/repos/postgres'

export const makePgCouponRepository = (): PgCouponRepository => {
  return new PgCouponRepository()
}
