import {
  Controller,
  addOrganizationsController as AddOrgController,
} from '@/application/controllers'
import { makeAddOrganizations } from '@/main/factories/domain/use-cases'

export const addOrganizationsController = (): Controller => {
  return new AddOrgController(makeAddOrganizations())
}
