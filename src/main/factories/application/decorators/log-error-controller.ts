import { LogErrorControllerDecorator } from '@/main/decorators'
import { Controller } from '@/application/controllers'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import { makePgErrorLogRepository } from '@/main/factories/infra/repos/postgres'

export const makeLogErrorControllerDecorator = (controller: Controller) => {
  return new LogErrorControllerDecorator(controller, makeUuidHandler(), makePgErrorLogRepository())
}
