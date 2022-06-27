import { mock } from 'jest-mock-extended'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { RevokePermissionUseCase } from '@/domain/use-cases/permissions'
import { UserNotFoundError } from '@/domain/entities/errors'

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

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    const loadUserRepositorySpy = mock<LoadUserAccount>()
    const sut = new RevokePermissionUseCase(loadUserRepositorySpy)

    const output = await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })
})
