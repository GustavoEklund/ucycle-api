import { PayOrder, PayOrderUseCase } from '@/domain/use-cases/order'
import { makePgOrderRepository, makePgUserAccountRepo } from '@/main/factories/infra/repos/postgres'
import { makeMercadoPagoSdkGateway } from '@/main/factories/infra/gateways/sdks'

export const makePayOrderUseCase = (): PayOrder => {
  return new PayOrderUseCase(
    makePgUserAccountRepo(),
    makePgOrderRepository(),
    makeMercadoPagoSdkGateway()
  )
}
