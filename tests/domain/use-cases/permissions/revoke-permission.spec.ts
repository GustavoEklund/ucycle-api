import { mock } from 'jest-mock-extended'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { RevokePermissionUseCase } from '@/domain/use-cases/permissions'

describe('RevokePermissionUseCase', () => {
  it('should call LoadUserRepository with correct input', async () => {
    const loadUserRepositorySpy = mock<LoadUserAccount>()
    const sut = new RevokePermissionUseCase(loadUserRepositorySpy)

    await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(loadUserRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
