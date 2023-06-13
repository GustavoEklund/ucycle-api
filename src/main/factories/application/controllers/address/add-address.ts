import { Controller } from '@/application/controllers'
import { AddAddressController } from '@/application/controllers/address'
import { makeAddAddressUseCase } from '@/main/factories/domain/use-cases/address'

export const makeAddAddressController = (): Controller => {
  return new AddAddressController(makeAddAddressUseCase())
}
