import { LoadMyAddressesController } from '@/application/controllers/address'
import { makeAddressQuery } from '@/main/factories/infra/query/postgres'
import { Controller } from '@/application/controllers'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators'

export const makeLoadMyAddressesController = (): Controller => {
  const controller = new LoadMyAddressesController(makeAddressQuery())
  return makeLogErrorControllerDecorator(controller)
}
