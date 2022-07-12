import { LoadMyOrganizationsController } from '@/application/controllers'
import { makeLoadMyOrganizations } from '@/main/factories/domain/use-cases'

export const makeLoadMyOrganizationsController = (): LoadMyOrganizationsController => {
  return new LoadMyOrganizationsController(makeLoadMyOrganizations())
}
