import { Controller, DeclineAdmissionProposalController } from '@/application/controllers'
import { makeDeclineAdmissionProposalUseCase } from '@/main/factories/domain/use-cases/organizations'

export const makeDeclineAdmissionProposalController = (): Controller => {
  return new DeclineAdmissionProposalController(makeDeclineAdmissionProposalUseCase())
}
