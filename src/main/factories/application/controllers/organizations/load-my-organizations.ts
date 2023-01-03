import { Controller, LoadMyOrganizationsController } from '@/application/controllers'
import { makeLoadMyOrganizations } from '@/main/factories/domain/use-cases'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators'

export const makeLoadMyOrganizationsController = (): Controller => {
  const controller = new LoadMyOrganizationsController(makeLoadMyOrganizations())
  return makeLogErrorControllerDecorator(controller)
}
