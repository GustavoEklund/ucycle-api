import { Controller } from '@/application/controllers'
import { LoadMySalesController } from '@/application/controllers/order'
import { makeOrderTypeOrmQuery } from '@/main/factories/infra/query/postgres'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators'

export const makeLoadMySalesController = (): Controller => {
  const controller = new LoadMySalesController(makeOrderTypeOrmQuery())
  return makeLogErrorControllerDecorator(controller)
}
