import { Coupon } from '@/domain/entities/order'

export interface LoadCoupon {
  load: (input: LoadCoupon.Input) => Promise<LoadCoupon.Output>
}

export namespace LoadCoupon {
  export type Input = {
    code: string
  }
  export type Output = Coupon | undefined
}
