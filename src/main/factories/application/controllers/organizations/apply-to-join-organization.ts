import { Controller } from '@/application/controllers'
import { ApplyToJoinOrganizationController } from '@/application/controllers/organizations'
import { makeApplyToJoinOrganizationUseCase } from '@/main/factories/domain/use-cases/organizations'
import {
  makeLogErrorControllerDecorator,
  makePgTransactionControllerDecorator,
} from '@/main/factories/application/decorators'

export const makeApplyToJoinOrganizationController = (): Controller => {
  const controller = new ApplyToJoinOrganizationController(makeApplyToJoinOrganizationUseCase())
  const dbTransactionControllerDecorator = makePgTransactionControllerDecorator(controller)
  return makeLogErrorControllerDecorator(dbTransactionControllerDecorator)
}
