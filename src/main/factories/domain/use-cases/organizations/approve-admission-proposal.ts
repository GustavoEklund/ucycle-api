import { ApproveAdmissionProposal, ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import {
  makePgAdmissionProposalRepo,
  makePgUserAccountRepo,
  makePgUserPermissionRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeApproveAdmissionProposalUseCase = (): ApproveAdmissionProposal => {
  return new ApproveAdmissionProposalUseCase(
    makePgUserAccountRepo(),
    makePgAdmissionProposalRepo(),
    makePgUserPermissionRepo()
  )
}
