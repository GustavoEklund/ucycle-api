import { ApproveAdmissionProposal, ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import { LoadAdmissionProposal, LoadUserAccount } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'
import { AdmissionProposalNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { mockUser } from '@/tests/domain/mocks/entities'

describe('ApproveAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let admissionProposalSpy: MockProxy<LoadAdmissionProposal>
  let sut: ApproveAdmissionProposal
  let inputStub: ApproveAdmissionProposal.Input

  beforeAll(() => {
    inputStub = {
      user: {
        id: 'any_user_id',
      },
      admissionProposal: {
        id: 'any_admission_proposal_id',
      },
    }
    userRepoSpy = mock()
    userRepoSpy.load.mockResolvedValue(mockUser())
    admissionProposalSpy = mock()
  })

  beforeEach(() => {
    sut = new ApproveAdmissionProposalUseCase(userRepoSpy, admissionProposalSpy)
  })

  it('should call LoadUserRepository with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })

  it('should call LoadAdmissionProposal with correct input', async () => {
    await sut.perform(inputStub)

    expect(admissionProposalSpy.load).toHaveBeenCalledWith({ id: 'any_admission_proposal_id' })
  })

  it('should return AdmissionProposalNotFoundError if LoadAdmissionProposal returns undefined', async () => {
    admissionProposalSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new AdmissionProposalNotFoundError('any_admission_proposal_id'))
  })
})
