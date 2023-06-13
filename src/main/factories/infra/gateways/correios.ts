import { CorreiosShippingHttpClientGateway } from '@/infra/gateways/http-client/correios-shipping'
import { ShippingCalculatorGateway } from '@/domain/contracts/gateways'
import { makeAxiosHttpClient } from '@/main/factories/infra/gateways/axios-client'
import { env } from '@/main/config/env'

export const makeCorreiosShippingHttpClientGateway = (): ShippingCalculatorGateway => {
  return new CorreiosShippingHttpClientGateway(
    makeAxiosHttpClient(),
    env.correios.baseApiUrl,
    '',
    '',
    '01310-904'
  )
}
