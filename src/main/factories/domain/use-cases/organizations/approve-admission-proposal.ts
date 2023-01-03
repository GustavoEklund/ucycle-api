import { ApproveAdmissionProposal, ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import {
  makePgAdmissionProposalRepo,
  makePgUserAccountRepo,
  makePgUserPermissionRepo,
} from '@/main/factories/infra/repos/postgres'
import { makeAdmissionProposalAcceptedHandler } from '@/main/factories/infra/event-handlers'

export const makeApproveAdmissionProposalUseCase = (): ApproveAdmissionProposal => {
  const approveAdmissionProposal = new ApproveAdmissionProposalUseCase(
    makePgUserAccountRepo(),
    makePgAdmissionProposalRepo(),
    makePgUserPermissionRepo()
  )
  approveAdmissionProposal.subscribe(makeAdmissionProposalAcceptedHandler())
  return approveAdmissionProposal
}
