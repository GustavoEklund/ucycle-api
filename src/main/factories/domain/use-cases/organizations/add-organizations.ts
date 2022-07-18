import { AddOrganizations, setupAddOrganizations } from '@/domain/use-cases'
import { makeUuidHandler } from '@/main/factories/infra/gateways/uuid'
import { makePgOrganizationRepo } from '@/main/factories/infra/repos/postgres/organization/organization'

export const makeAddOrganizations = (): AddOrganizations => {
  return setupAddOrganizations(makePgOrganizationRepo(), makeUuidHandler())
}
