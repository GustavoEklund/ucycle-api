import { AddOrganizations, setupAddOrganizations } from '@/domain/use-cases'
import { makePgOrganizationRepo } from '@/main/factories/infra/repos/postgres/organization/organization'

export const makeAddOrganizations = (): AddOrganizations => {
  return setupAddOrganizations(makePgOrganizationRepo())
}
