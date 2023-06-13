import { RemoveAddressController } from '@/application/controllers/address'
import { makeRemoveAddressUseCase } from '@/main/factories/domain/use-cases/address'
import { Controller } from '@/application/controllers'

export const makeRemoveAddressController = (): Controller => {
  return new RemoveAddressController(makeRemoveAddressUseCase())
}
