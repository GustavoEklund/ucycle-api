import { UpdateOrganizationController } from '@/application/controllers/organizations/update-organization'
import { makeUpdateOrganization } from '@/main/factories/domain/use-cases/organizations/update-organization'

export const makeUpdateOrganizationController = (): UpdateOrganizationController => {
  return new UpdateOrganizationController(makeUpdateOrganization())
}
