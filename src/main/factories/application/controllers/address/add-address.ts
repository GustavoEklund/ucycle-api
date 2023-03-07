import { Controller } from '@/application/controllers'
import { AddAddressController } from '@/application/controllers/address'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'
import { makeAddAddressUseCase } from '@/main/factories/domain/use-cases/address'

export const makeAddAddressController = (): Controller => {
  const controller = new AddAddressController(makeAddAddressUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
