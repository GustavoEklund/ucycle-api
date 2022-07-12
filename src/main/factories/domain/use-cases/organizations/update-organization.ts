import { UpdateOrganization, UpdateOrganizationUseCase } from '@/domain/use-cases/organizations'
import {
  makePgOrganizationRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeUpdateOrganization = (): UpdateOrganization => {
  return new UpdateOrganizationUseCase(makePgOrganizationRepo(), makePgUserAccountRepo())
}
