import { ApproveAdmissionProposalController } from '@/application/controllers/organizations'
import { ApproveAdmissionProposal } from '@/domain/use-cases'
import { mock, MockProxy } from 'jest-mock-extended'
import { notFound } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { RequiredString } from '@/application/validation'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { AdmissionProposalNotFoundError } from '@/domain/entities/errors/organization'

describe('ApproveAdmissionProposalController', () => {
  let httpResponseStub: MockProxy<{ userId: string; admissionProposalId: string }>
  let sut: ApproveAdmissionProposalController
  let approveAdmissionProposalSpy: MockProxy<ApproveAdmissionProposal>

  beforeAll(() => {
    httpResponseStub = {
      userId: 'any_user_id',
      admissionProposalId: 'any_admission_proposal_id',
    }
    approveAdmissionProposalSpy = mock()
    approveAdmissionProposalSpy.perform.mockResolvedValue(undefined)
  })

  beforeEach(() => {
    sut = new ApproveAdmissionProposalController(approveAdmissionProposalSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'userId'),
      new RequiredString('any_admission_proposal_id', 'admissionProposalId'),
    ]

    const validators = sut.buildValidators({
      userId: 'any_user_id',
      admissionProposalId: 'any_admission_proposal_id',
    })

    expect(validators).toEqual(expectedValidators)
  })

  it('should call ApproveAdmissionProposal with correct input', async () => {
    await sut.handle(httpResponseStub)

    expect(approveAdmissionProposalSpy.perform).toHaveBeenCalledTimes(1)
    expect(approveAdmissionProposalSpy.perform).toHaveBeenCalledWith({
      user: { id: 'any_user_id' },
      admissionProposal: { id: 'any_admission_proposal_id' },
    })
  })

  it('should return 404 if ApproveAdmissionProposal return AdmissionProposalNotFoundError', async () => {
    const expectedError = new AdmissionProposalNotFoundError('any_admission_proposal_id')
    const expectedHttpResponse = notFound([expectedError])
    approveAdmissionProposalSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.handle(httpResponseStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 404 if ApproveAdmissionProposal returns UserNotFoundError', async () => {
    const expectedError = new UserNotFoundError('any_user_id')
    const expectedHttpResponse = notFound([expectedError])
    approveAdmissionProposalSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.handle(httpResponseStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 200 if ApproveAdmissionProposal returns undefined', async () => {
    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      admissionProposalId: 'any_admission_proposal_id',
    })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: undefined,
    })
  })
})
