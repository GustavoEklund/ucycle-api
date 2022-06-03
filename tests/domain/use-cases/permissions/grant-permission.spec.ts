import { LoadUserAccount } from '@/domain/contracts/repos'
import { mock } from 'jest-mock-extended'
import { GrantPermissionUseCase } from '@/domain/use-cases/permissions'

describe('GrantPermissionUseCase', () => {
  it('should call LoadUserAccount with correct input', async () => {
    const userRepo = mock<LoadUserAccount>()
    const sut = new GrantPermissionUseCase(userRepo)

    await sut.perform({ userId: 'any_user_id' })

    expect(userRepo.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
