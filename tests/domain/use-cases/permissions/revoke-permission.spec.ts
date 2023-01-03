import { LoadUserAccount, LoadUserPermission, SaveUserPermission } from '@/domain/contracts/repos'
import { RevokePermission, RevokePermissionUseCase } from '@/domain/use-cases/permissions'
import { User } from '@/domain/entities/user'
import { UserPermission } from '@/domain/entities/permission'
import { mockUser, mockUserPermission } from '@/tests/domain/mocks/entities'

import { mock, MockProxy } from 'jest-mock-extended'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { UserPermissionNotFoundError } from '@/domain/entities/errors/permission/user-permission-not-found'

describe('RevokePermissionUseCase', () => {
  let userRepositorySpy: MockProxy<LoadUserAccount>
  let userPermissionRepositorySpy: MockProxy<LoadUserPermission & SaveUserPermission>
  let userStub: User
  let targetUserStub: User
  let userPermissionStub: UserPermission
  let sut: RevokePermissionUseCase
  let inputStub: RevokePermission.Input

  beforeAll(() => {
    inputStub = {
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    }
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
    await sut.perform(inputStub)

    expect(userRepositorySpy.load).toHaveBeenNthCalledWith(1, { id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    userRepositorySpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })

  it('should call LoadUserRepository with correct input for target user', async () => {
    await sut.perform(inputStub)

    expect(userRepositorySpy.load).toHaveBeenNthCalledWith(2, { id: 'any_target_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined for target user', async () => {
    userRepositorySpy.load.mockResolvedValueOnce(mockUser()).mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UserNotFoundError('any_target_user_id'))
  })

  it('should call LoadUserPermissionRepository with correct input', async () => {
    await sut.perform(inputStub)

    expect(userPermissionRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_permission_id' })
  })

  it('should return UserPermissionNotFound if LoadUserPermissionRepository returns undefined', async () => {
    userPermissionRepositorySpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UserPermissionNotFoundError('any_permission_id'))
  })

  it('should call SaveUserPermissionRepository with correct input', async () => {
    const revokeSpy = jest.spyOn(userPermissionStub, 'revoke')

    await sut.perform(inputStub)

    expect(revokeSpy).toHaveBeenCalledTimes(1)
    expect(userPermissionRepositorySpy.save).toHaveBeenCalledTimes(1)
    expect(userPermissionRepositorySpy.save).toHaveBeenCalledWith(userPermissionStub)
  })
})
