import { Controller, SignUpController } from '@/application/controllers'
import { makeSignUpUseCase } from '@/main/factories/domain/use-cases/users'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators/log-error-controller'
import { makePgTransactionControllerDecorator } from '@/main/factories/application/decorators'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeSignUpUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
