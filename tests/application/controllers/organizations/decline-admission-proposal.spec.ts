import { DeclineAdmissionProposalController } from '@/application/controllers'
import { DeclineAdmissionProposal } from '@/domain/use-cases'

import { mock } from 'jest-mock-extended'

describe('DeclineAdmissionProposalController', () => {
  it('should call DeclineAdmissionProposal with correct input', async () => {
    const declineAdmissionProposalSpy = mock<DeclineAdmissionProposal>()
    const sut = new DeclineAdmissionProposalController(declineAdmissionProposalSpy)

    await sut.handle({
      userId: 'any_user_id',
      admissionProposalId: 'any_admission_proposal_id',
    })

    expect(declineAdmissionProposalSpy.perform).toHaveBeenCalledTimes(1)
    expect(declineAdmissionProposalSpy.perform).toHaveBeenCalledWith({
      user: { id: 'any_user_id' },
      admissionProposal: { id: 'any_admission_proposal_id' },
    })
  })
})
