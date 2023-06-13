import { Controller } from '@/application/controllers'
import { LoadMyOrdersController } from '@/application/controllers/order'
import { makeOrderTypeOrmQuery } from '@/main/factories/infra/query/postgres'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators'

export const makeLoadMyOrdersController = (): Controller => {
  const controller = new LoadMyOrdersController(makeOrderTypeOrmQuery())
  return makeLogErrorControllerDecorator(controller)
}
