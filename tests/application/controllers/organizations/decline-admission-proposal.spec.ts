import { Controller, DeclineAdmissionProposalController } from '@/application/controllers'
import { DeclineAdmissionProposal } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'
import {
  AdmissionProposalNotFoundError,
  UnauthorizedUserError,
  UserNotFoundError,
} from '@/domain/entities/errors'

describe('DeclineAdmissionProposalController', () => {
  let httpRequestStub: { userId: string; admissionProposalId: string }
  let declineAdmissionProposalSpy: MockProxy<DeclineAdmissionProposal>
  let sut: DeclineAdmissionProposalController

  beforeAll(() => {
    httpRequestStub = {
      userId: 'any_user_id',
      admissionProposalId: 'any_admission_proposal_id',
    }
    declineAdmissionProposalSpy = mock()
  })

  beforeEach(() => {
    sut = new DeclineAdmissionProposalController(declineAdmissionProposalSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call DeclineAdmissionProposal with correct input', async () => {
    await sut.handle(httpRequestStub)

    expect(declineAdmissionProposalSpy.perform).toHaveBeenCalledTimes(1)
    expect(declineAdmissionProposalSpy.perform).toHaveBeenCalledWith({
      user: { id: 'any_user_id' },
      admissionProposal: { id: 'any_admission_proposal_id' },
    })
  })

  it('should return 404 if DeclineAdmissionProposal returns UserNotFoundError', async () => {
    const expectedError = new UserNotFoundError('any_user_id')
    declineAdmissionProposalSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: [expectedError],
    })
  })

  it('should return 404 if DeclineAdmissionProposal returns AdmissionProposalNotFoundError', async () => {
    const expectedError = new AdmissionProposalNotFoundError('any_admission_proposal_id')
    declineAdmissionProposalSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: [expectedError],
    })
  })

  it('should return 403 if DeclineAdmissionProposal returns UnauthorizedUserError', async () => {
    const expectedError = new UnauthorizedUserError('any_user_id', 'any_permission_code')
    declineAdmissionProposalSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: [expectedError],
    })
  })

  it('should return 200 if DeclineAdmissionProposal returns undefined', async () => {
    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: undefined,
    })
  })
})
