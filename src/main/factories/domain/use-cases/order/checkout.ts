import { Checkout, CheckoutUseCase } from '@/domain/use-cases/order'
import {
  makeCorreiosShippingHttpClientGateway,
  makeUuidHandler,
} from '@/main/factories/infra/gateways'
import {
  makePgCouponRepository,
  makePgOrderRepository,
  makePgProductRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'
// import { makeMercadoPagoSdkGateway } from '@/main/factories/infra/gateways/sdks'

export const makeCheckoutUseCase = (): Checkout => {
  // const shippingGatewayMock = {
  //   calculate: () =>
  //     Promise.resolve({
  //       estimatedDeliveryDate: new Date(),
  //       valueInCents: 2607,
  //     }),
  // }
  return new CheckoutUseCase(
    makeUuidHandler(),
    makePgUserAccountRepo(),
    makePgProductRepo(),
    makePgCouponRepository(),
    makePgOrderRepository(),
    makeCorreiosShippingHttpClientGateway()
  )
}
