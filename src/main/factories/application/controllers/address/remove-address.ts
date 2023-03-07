import { RemoveAddressController } from '@/application/controllers/address'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'
import { makeRemoveAddressUseCase } from '@/main/factories/domain/use-cases/address'
import { Controller } from '@/application/controllers'

export const makeRemoveAddressController = (): Controller => {
  const controller = new RemoveAddressController(makeRemoveAddressUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
