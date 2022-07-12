import { ApproveAdmissionProposalController, Controller } from '@/application/controllers'
import { makeApproveAdmissionProposalUseCase } from '@/main/factories/domain/use-cases'

export const makeApproveAdmissionProposalController = (): Controller => {
  return new ApproveAdmissionProposalController(makeApproveAdmissionProposalUseCase())
}
