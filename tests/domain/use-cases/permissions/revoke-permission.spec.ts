import { mock, MockProxy } from 'jest-mock-extended'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { RevokePermissionUseCase } from '@/domain/use-cases/permissions'
import { UserNotFoundError } from '@/domain/entities/errors'
import { mockUser } from '@/tests/domain/mocks/entities'

describe('RevokePermissionUseCase', () => {
  let userRepositorySpy: MockProxy<LoadUserAccount>
  let sut: RevokePermissionUseCase

  beforeAll(() => {
    userRepositorySpy = mock()
    userRepositorySpy.load.mockResolvedValue(mockUser())
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

    expect(userRepositorySpy.load).toHaveBeenNthCalledWith(1, { id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    userRepositorySpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })

  it('should call LoadUserRepository with correct input for target user', async () => {
    await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(userRepositorySpy.load).toHaveBeenNthCalledWith(2, { id: 'any_target_user_id' })
  })
})
