import { Controller } from '@/application/controllers'
import { PayOrderController } from '@/application/controllers/order'
import { makePayOrderUseCase } from '@/main/factories/domain/use-cases/order'

export const makePayOrderController = (): Controller => {
  return new PayOrderController(makePayOrderUseCase())
}
