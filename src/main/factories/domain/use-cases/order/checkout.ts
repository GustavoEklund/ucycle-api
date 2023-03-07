import { Checkout, CheckoutUseCase } from '@/domain/use-cases/order'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import {
  makePgCouponRepository,
  makePgOrderRepository,
  makePgProductRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeCheckoutUseCase = (): Checkout => {
  return new CheckoutUseCase(
    makeUuidHandler(),
    makePgUserAccountRepo(),
    makePgProductRepo(),
    makePgCouponRepository(),
    makePgOrderRepository(),
    {
      calculate: () =>
        Promise.resolve({
          estimatedDeliveryDate: new Date(),
          valueInCents: 2607,
        }),
    }
  )
}
