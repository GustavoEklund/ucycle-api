import { LoadMyOrganizations, LoadMyOrganizationsUseCase } from '@/domain/use-cases'
import { makePgOrganizationRepo } from '@/main/factories/infra/repos/postgres'

export const makeLoadMyOrganizations = (): LoadMyOrganizations => {
  return new LoadMyOrganizationsUseCase(makePgOrganizationRepo())
}
