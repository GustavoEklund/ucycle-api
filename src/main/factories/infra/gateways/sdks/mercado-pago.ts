import { CreatePayment } from '@/domain/contracts/gateways'
import { MercadoPagoSdkGateway } from '@/infra/gateways/sdks'
import { env } from '@/main/config/env'

export const makeMercadoPagoSdkGateway = (): CreatePayment => {
  return new MercadoPagoSdkGateway(env.mercadoPago.accessToken, {})
}
