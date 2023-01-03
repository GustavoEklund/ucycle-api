import { Controller, VerifyContactController } from '@/application/controllers'
import { makeVerifyContact } from '@/main/factories/domain/use-cases/users'
import { makePgTransactionControllerDecorator } from '@/main/factories/application/decorators'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators/log-error-controller'

export const makeVerifyContactController = (): Controller => {
  const controller = new VerifyContactController(makeVerifyContact())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
