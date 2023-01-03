import { Controller } from '@/application/controllers'
import { LogErrorControllerDecorator } from '@/application/decorators'
import { makeLogErrorsUseCase } from '@/main/factories/domain/use-cases/errors'
import { makePgConnection } from '@/main/factories/infra/repos/postgres/helpers'

export const makeLogErrorControllerDecorator = (controller: Controller) => {
  return new LogErrorControllerDecorator(controller, makeLogErrorsUseCase(), makePgConnection())
}
