import { DeclineAdmissionProposal, DeclineAdmissionProposalUseCase } from '@/domain/use-cases'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadAdmissionProposal, LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'
import { mockUser } from '@/tests/domain/mocks/entities'
import { User } from '@/domain/entities/user'

describe('DeclineAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let admissionProposalRepoSpy: MockProxy<LoadAdmissionProposal>
  let sut: DeclineAdmissionProposal
  let inputStub: DeclineAdmissionProposal.Input
  let userStub: User

  beforeAll(() => {
    userRepoSpy = mock()
    userStub = mockUser()
    userRepoSpy.load.mockResolvedValue(userStub)
    admissionProposalRepoSpy = mock()
    inputStub = {
      user: {
        id: userStub.id,
      },
      admissionProposal: {
        id: 'any_admission_proposal_id',
      },
    }
  })

  beforeEach(() => {
    sut = new DeclineAdmissionProposalUseCase(userRepoSpy, admissionProposalRepoSpy)
  })

  it('should call LoadUser with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: userStub.id })
  })

  it('should return UserNotFoundError if LoadUser returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)
    const expectedError = new UserNotFoundError('any_user_id')

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedError)
  })

  it('should call LoadAdmissionProposal with correct input', async () => {
    await sut.perform(inputStub)

    expect(admissionProposalRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.load).toHaveBeenCalledWith({ id: 'any_admission_proposal_id' })
  })
})
