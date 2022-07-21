import { DeclineAdmissionProposal, DeclineAdmissionProposalUseCase } from '@/domain/use-cases'
import {
  makePgAdmissionProposalRepo,
  makePgUserAccountRepo,
  makePgUserPermissionRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeDeclineAdmissionProposalUseCase = (): DeclineAdmissionProposal => {
  return new DeclineAdmissionProposalUseCase(
    makePgUserAccountRepo(),
    makePgAdmissionProposalRepo(),
    makePgUserPermissionRepo()
  )
}
