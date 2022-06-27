import { mock } from 'jest-mock-extended'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { RevokePermissionUseCase } from '@/domain/use-cases/permissions'
import { UserNotFoundError } from '@/domain/entities/errors'

describe('RevokePermissionUseCase', () => {
  let userRepositorySpy: LoadUserAccount
  let sut: RevokePermissionUseCase

  beforeAll(() => {
    userRepositorySpy = mock()
  })

  beforeEach(() => {
    sut = new RevokePermissionUseCase(userRepositorySpy)
  })

  it('should call LoadUserRepository with correct input', async () => {
    await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(userRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
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
