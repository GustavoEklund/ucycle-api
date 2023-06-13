import { CalculateFreightController } from '@/application/controllers/freight'
import { Controller } from '@/application/controllers'
import { makeCorreiosShippingHttpClientGateway } from '@/main/factories/infra/gateways'

export const makeCalculateFreightController = (): Controller => {
  return new CalculateFreightController(makeCorreiosShippingHttpClientGateway())
}
