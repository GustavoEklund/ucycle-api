import { LoadBasePermission, LoadUserAccount, SavePermission } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'
import { GrantPermission, GrantPermissionUseCase } from '@/domain/use-cases/permissions'
import { BasePermissionNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'

describe('GrantPermissionUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let permissionRepoSpy: MockProxy<SavePermission>
  let basePermissionRepoSpy: MockProxy<LoadBasePermission>
  let grantPermissionInput: GrantPermission.Input
  let sut: GrantPermissionUseCase

  beforeAll(() => {
    grantPermissionInput = {
      grantById: 'any_user_id',
      grantToId: 'any_target_user_id',
      code: 'any_permission_code',
      write: true,
      read: true,
      owner: false,
      status: 'GRANTED',
      moduleId: 'any_module_id',
      resourceId: 'any_resource_id',
    }
    userRepoSpy = mock()
    userRepoSpy.load.mockResolvedValue({
      id: 'any_user_id',
      lastName: 'any_last_name',
      firstName: 'any_first_name',
      contacts: [],
      documents: [],
    })
    basePermissionRepoSpy = mock()
    basePermissionRepoSpy.load.mockResolvedValue({
      id: 'any_base_permission_id',
      code: 'any_permission_code',
      read: true,
      write: true,
      owner: false,
      name: 'any_permission_name',
      description: 'any_permission_description',
      moduleId: 'any_module_id',
    })
    permissionRepoSpy = mock()
    permissionRepoSpy.save.mockResolvedValue({ id: 'any_permission_id' })
  })

  beforeEach(() => {
    sut = new GrantPermissionUseCase(userRepoSpy, basePermissionRepoSpy, permissionRepoSpy)
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform(grantPermissionInput)

    expect(userRepoSpy.load.mock.calls[0][0]).toEqual({ id: 'any_user_id' })
  })

  it('should return UserAccountNotFoundError if LoadUserAccount returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual(new UserAccountNotFoundError('any_user_id'))
  })

  it('should call LoadUserAccount with correct input for target user', async () => {
    await sut.perform(grantPermissionInput)

    expect(userRepoSpy.load.mock.calls[1][0]).toEqual({ id: 'any_target_user_id' })
    expect(userRepoSpy.load).toHaveBeenCalledTimes(2)
  })

  it('should return UserAccountNotFoundError if LoadUserAccount returns undefined for target user', async () => {
    userRepoSpy.load
      .mockResolvedValueOnce({
        id: 'any_user_id',
        lastName: 'any_last_name',
        firstName: 'any_first_name',
        contacts: [],
        documents: [],
      })
      .mockResolvedValueOnce(undefined)

    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual(new UserAccountNotFoundError('any_target_user_id'))
  })

  it('should call LoadBasePermission with correct input', async () => {
    await sut.perform(grantPermissionInput)

    expect(basePermissionRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(basePermissionRepoSpy.load).toHaveBeenCalledWith({ code: 'any_permission_code' })
  })

  it('should return BasePermissionNotFoundError if LoadBasePermission returns undefined', async () => {
    basePermissionRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual(new BasePermissionNotFoundError('any_permission_code'))
  })

  it('should call SavePermission with correct input', async () => {
    await sut.perform(grantPermissionInput)

    expect(permissionRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(permissionRepoSpy.save).toHaveBeenCalledWith({
      grantById: 'any_user_id',
      grantToId: 'any_target_user_id',
      code: 'any_permission_code',
      read: true,
      write: true,
      owner: false,
      status: 'GRANTED',
      moduleId: 'any_module_id',
      resourceId: 'any_resource_id',
    })
  })

  it('should return correct output on success', async () => {
    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual({ id: 'any_permission_id' })
  })
})
