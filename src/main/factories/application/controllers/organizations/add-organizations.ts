import { Controller, AddOrganizationsController } from '@/application/controllers'
import { makeAddOrganizations } from '@/main/factories/domain/use-cases'

export const makeAddOrganizationsController = (): Controller => {
  return new AddOrganizationsController(makeAddOrganizations())
}
