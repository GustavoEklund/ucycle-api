import { LoadUserAccount, SavePermission } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'
import { GrantPermission, GrantPermissionUseCase } from '@/domain/use-cases/permissions'
import { UserAccountNotFoundError } from '@/domain/entities/errors'

describe('GrantPermissionUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let permissionRepoSpy: MockProxy<SavePermission>
  let grantPermissionInput: GrantPermission.Input
  let sut: GrantPermissionUseCase

  beforeAll(() => {
    grantPermissionInput = {
      grantById: 'any_user_id',
      grantToId: 'any_target_user_id',
      resourceCode: 'any_resource_code',
      resourceName: 'any_resource_name',
      description: 'any_resource_description',
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
    permissionRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new GrantPermissionUseCase(userRepoSpy, permissionRepoSpy)
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

  it('should call SavePermission with correct input', async () => {
    await sut.perform(grantPermissionInput)

    expect(permissionRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(permissionRepoSpy.save).toHaveBeenCalledWith({
      grantById: 'any_user_id',
      grantToId: 'any_target_user_id',
      resourceCode: 'any_resource_code',
      resourceName: 'any_resource_name',
      description: 'any_resource_description',
      read: true,
      write: true,
      owner: false,
      status: 'GRANTED',
      moduleId: 'any_module_id',
      resourceId: 'any_resource_id',
    })
  })
})
