import { DeclineAdmissionProposalController } from '@/application/controllers'
import { DeclineAdmissionProposal } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'
import { UserNotFoundError } from '@/domain/entities/errors'

describe('DeclineAdmissionProposalController', () => {
  let declineAdmissionProposalSpy: MockProxy<DeclineAdmissionProposal>
  let sut: DeclineAdmissionProposalController

  beforeAll(() => {
    declineAdmissionProposalSpy = mock()
  })

  beforeEach(() => {
    sut = new DeclineAdmissionProposalController(declineAdmissionProposalSpy)
  })

  it('should call DeclineAdmissionProposal with correct input', async () => {
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

  it('should return 404 if DeclineAdmissionProposal returns UserNotFoundError', async () => {
    const expectedError = new UserNotFoundError('any_user_id')
    declineAdmissionProposalSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      admissionProposalId: 'any_admission_proposal_id',
    })

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: [expectedError],
    })
  })
})
