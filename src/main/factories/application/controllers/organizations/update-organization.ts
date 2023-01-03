import { UpdateOrganizationController } from '@/application/controllers/organizations/update-organization'
import { makeUpdateOrganization } from '@/main/factories/domain/use-cases/organizations/update-organization'
import { makePgTransactionControllerDecorator } from '@/main/factories/application/decorators'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators/log-error-controller'
import { Controller } from '@/application/controllers'

export const makeUpdateOrganizationController = (): Controller => {
  const controller = new UpdateOrganizationController(makeUpdateOrganization())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
