import {
  ApplyToJoinOrganization,
  ApplyToJoinOrganizationUseCase,
} from '@/domain/use-cases/organizations'
import {
  makePgAdmissionProposalRepo,
  makePgOrganizationMemberRepo,
  makePgOrganizationRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'
import { makeApplicationToJoinOrganizationSentHandler } from '@/main/factories/infra/event-handlers'

export const makeApplyToJoinOrganizationUseCase = (): ApplyToJoinOrganization => {
  const applyToJoinOrganization = new ApplyToJoinOrganizationUseCase(
    makePgUserAccountRepo(),
    makePgOrganizationRepo(),
    makePgAdmissionProposalRepo(),
    makePgOrganizationMemberRepo()
  )
  applyToJoinOrganization.subscribe(makeApplicationToJoinOrganizationSentHandler())
  return applyToJoinOrganization
}
