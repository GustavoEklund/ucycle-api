import { DeclineAdmissionProposal, DeclineAdmissionProposalUseCase } from '@/domain/use-cases'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'

describe('DeclineAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let sut: DeclineAdmissionProposal

  beforeAll(() => {
    userRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new DeclineAdmissionProposalUseCase(userRepoSpy)
  })

  it('should call LoadUserRepository with correct input', async () => {
    await sut.perform({ user: { id: 'any_user_id' } })

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)
    const expectedError = new UserNotFoundError('any_user_id')

    const output = await sut.perform({ user: { id: 'any_user_id' } })

    expect(output).toEqual(expectedError)
  })
})
