import { AddOrganizationsController, Controller } from '@/application/controllers'
import { makeAddOrganizations } from '@/main/factories/domain/use-cases'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators/log-error-controller'
import { makePgTransactionControllerDecorator } from '@/main/factories/application/decorators'

export const makeAddOrganizationsController = (): Controller => {
  const controller = new AddOrganizationsController(makeAddOrganizations())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
