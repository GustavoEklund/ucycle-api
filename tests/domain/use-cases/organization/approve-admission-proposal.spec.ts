import { ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import { LoadUserAccount } from '@/domain/contracts/repos'

import { mock } from 'jest-mock-extended'

describe('ApproveAdmissionProposalUseCase', () => {
  it('should call LoadUserRepository with correct input', async () => {
    const userRepoSpy = mock<LoadUserAccount>()
    const sut = new ApproveAdmissionProposalUseCase(userRepoSpy)

    await sut.perform({ user: { id: 'any_user_id' } })

    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
