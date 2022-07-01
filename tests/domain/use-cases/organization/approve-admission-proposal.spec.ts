import { ApproveAdmissionProposal, ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import { LoadUserAccount } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'
import { UserNotFoundError } from '@/domain/entities/errors'

describe('ApproveAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let sut: ApproveAdmissionProposal

  beforeAll(() => {
    userRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new ApproveAdmissionProposalUseCase(userRepoSpy)
  })

  it('should call LoadUserRepository with correct input', async () => {
    const sut = new ApproveAdmissionProposalUseCase(userRepoSpy)

    await sut.perform({ user: { id: 'any_user_id' } })

    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    const output = await sut.perform({ user: { id: 'any_user_id' } })

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })
})
