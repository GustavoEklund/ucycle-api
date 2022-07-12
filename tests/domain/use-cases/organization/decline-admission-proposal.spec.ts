import { DeclineAdmissionProposalUseCase } from '@/domain/use-cases'
import { mock } from 'jest-mock-extended'
import { LoadUserAccount } from '@/domain/contracts/repos'

describe('DeclineAdmissionProposalUseCase', () => {
  it('should call LoadUserRepository with correct input', async () => {
    const userRepoSpy = mock<LoadUserAccount>()
    const sut = new DeclineAdmissionProposalUseCase(userRepoSpy)

    await sut.perform({ user: { id: 'any_user_id' } })

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
