import {
  ApplyToJoinOrganization,
  ApplyToJoinOrganizationUseCase,
} from '@/domain/use-cases/organizations'
import {
  makePgAdmissionProposalRepo,
  makePgOrganizationRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeApplyToJoinOrganizationUseCase = (): ApplyToJoinOrganization => {
  return new ApplyToJoinOrganizationUseCase(
    makePgUserAccountRepo(),
    makePgOrganizationRepo(),
    makePgAdmissionProposalRepo()
  )
}
