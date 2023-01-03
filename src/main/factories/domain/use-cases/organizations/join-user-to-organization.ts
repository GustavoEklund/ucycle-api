import { JoinUserToOrganization, JoinUserToOrganizationUseCase } from '@/domain/use-cases'
import {
  makePgOrganizationRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeJoinUserToOrganizationUseCase = (): JoinUserToOrganization => {
  const currentDate = new Date()
  return new JoinUserToOrganizationUseCase(
    makePgUserAccountRepo(),
    makePgOrganizationRepo(),
    currentDate
  )
}
