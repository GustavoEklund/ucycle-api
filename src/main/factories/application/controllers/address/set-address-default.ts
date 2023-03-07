import { SetAddressDefaultController } from '@/application/controllers/address'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'
import { Controller } from '@/application/controllers'
import { makeSetAddressDefaultUseCase } from '@/main/factories/domain/use-cases/address'

export const makeSetAddressDefaultController = (): Controller => {
  const controller = new SetAddressDefaultController(makeSetAddressDefaultUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
