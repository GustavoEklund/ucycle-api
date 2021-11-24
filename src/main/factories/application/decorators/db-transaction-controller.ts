import { Controller } from '@/application/controllers'
import { DbTransactionControllerDecorator } from '@/application/decorators'
import { makePgConnection } from '@/main/factories/infra/repos/postgres/helpers'

export const makePgTransactionControllerDecorator = (controller: Controller): Controller => {
  return new DbTransactionControllerDecorator(controller, makePgConnection())
}
