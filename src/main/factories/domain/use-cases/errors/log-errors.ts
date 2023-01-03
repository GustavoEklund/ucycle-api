import { LogErrors, LogErrorsUseCase } from '@/domain/use-cases/errors'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import { makePgErrorLogRepository } from '@/main/factories/infra/repos/postgres'

export const makeLogErrorsUseCase = (): LogErrors => {
  return new LogErrorsUseCase(makeUuidHandler(), makePgErrorLogRepository())
}
