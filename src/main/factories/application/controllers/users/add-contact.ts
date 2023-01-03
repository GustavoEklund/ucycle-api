import { AddContactController, Controller } from '@/application/controllers'
import { makeAddContactUseCase } from '@/main/factories/domain/use-cases/users'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'

export const makeAddContactController = (): Controller => {
  const controller = new AddContactController(makeAddContactUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
