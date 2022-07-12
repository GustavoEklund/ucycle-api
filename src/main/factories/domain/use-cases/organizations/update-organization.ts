import { UpdateOrganization, UpdateOrganizationUseCase } from '@/domain/use-cases'
import { makePgUserAccountRepo, makePgOrganizationRepo } from '@/main/factories/infra/repos/postgres'

export const makeUpdateOrganization = (): UpdateOrganization => {
  return new UpdateOrganizationUseCase(makePgOrganizationRepo(), makePgUserAccountRepo())
}
