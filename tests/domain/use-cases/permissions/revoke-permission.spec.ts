import { LoadUserAccount, LoadUserPermission, SaveUserPermission } from '@/domain/contracts/repos'
import { RevokePermissionUseCase } from '@/domain/use-cases/permissions'
import { UserNotFoundError } from '@/domain/entities/errors'
import { User } from '@/domain/entities/user'
import { UserPermission } from '@/domain/entities/permission'
import { mockUser, mockUserPermission } from '@/tests/domain/mocks/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('RevokePermissionUseCase', () => {
  let userRepositorySpy: MockProxy<LoadUserAccount>
  let userPermissionRepositorySpy: MockProxy<LoadUserPermission & SaveUserPermission>
  let userStub: User
  let targetUserStub: User
  let userPermissionStub: UserPermission
  let sut: RevokePermissionUseCase

  beforeAll(() => {
    userStub = mockUser()
    targetUserStub = mockUser()
    userPermissionStub = mockUserPermission()
    userRepositorySpy = mock()
    userRepositorySpy.load.mockResolvedValue(userStub).mockResolvedValue(targetUserStub)
    userPermissionRepositorySpy = mock()
    userPermissionRepositorySpy.load.mockResolvedValue(userPermissionStub)
  })

  beforeEach(() => {
    sut = new RevokePermissionUseCase(userRepositorySpy, userPermissionRepositorySpy)
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

  it('should return UserNotFoundError if LoadUserRepository returns undefined for target user', async () => {
    userRepositorySpy.load.mockResolvedValueOnce(mockUser()).mockResolvedValueOnce(undefined)

    const output = await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(output).toEqual(new UserNotFoundError('any_target_user_id'))
  })

  it('should call LoadUserPermissionRepository with correct input', async () => {
    await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(userPermissionRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_permission_id' })
  })

  it('should call SaveUserPermissionRepository with correct input', async () => {
    const revokeSpy = jest.spyOn(userPermissionStub, 'revoke')

    await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(revokeSpy).toHaveBeenCalledTimes(1)
    expect(userPermissionRepositorySpy.save).toHaveBeenCalledTimes(1)
    expect(userPermissionRepositorySpy.save).toHaveBeenCalledWith(userPermissionStub)
  })
})
