import { LoadBasePermission, LoadUserAccount, SaveUserPermission } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'
import { GrantPermission, GrantPermissionUseCase } from '@/domain/use-cases/permissions'
import { BasePermissionNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'
import { BasePermission } from '@/domain/entities/permission/base-permission'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { UserPermission } from '@/domain/entities/permission'
import { mockUser } from '@/tests/domain/mocks/entities'

describe('GrantPermissionUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let permissionRepoSpy: MockProxy<SaveUserPermission>
  let basePermissionRepoSpy: MockProxy<LoadBasePermission>
  let grantPermissionInput: GrantPermission.Input
  let cryptoSpy: MockProxy<UUIDGenerator>
  let sut: GrantPermissionUseCase

  beforeAll(() => {
    grantPermissionInput = {
      grantById: 'any_user_id',
      grantToId: 'any_target_user_id',
      code: 'ANY_PERMISSION_CODE',
      write: true,
      read: true,
      owner: false,
      moduleId: 'any_module_id',
      organizationId: 'any_organization_id',
    }
    userRepoSpy = mock()
    userRepoSpy.load.mockResolvedValue(mockUser())
    basePermissionRepoSpy = mock()
    basePermissionRepoSpy.load.mockResolvedValue(
      new BasePermission({
        id: 'any_base_permission_id',
        code: 'ANY_PERMISSION_CODE',
        read: true,
        write: true,
        owner: false,
        name: 'any_permission_name',
        description: 'any_permission_description',
        moduleId: 'any_module_id',
        expiration: new Date('2021-03-01T10:00:00'),
      })
    )
    permissionRepoSpy = mock()
    cryptoSpy = mock()
    cryptoSpy.uuid.mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new GrantPermissionUseCase(
      userRepoSpy,
      basePermissionRepoSpy,
      permissionRepoSpy,
      cryptoSpy
    )
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
    userRepoSpy.load.mockResolvedValueOnce(mockUser()).mockResolvedValueOnce(undefined)

    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual(new UserAccountNotFoundError('any_target_user_id'))
  })

  it('should call LoadBasePermission with correct input', async () => {
    await sut.perform(grantPermissionInput)

    expect(basePermissionRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(basePermissionRepoSpy.load).toHaveBeenCalledWith({ code: 'ANY_PERMISSION_CODE' })
  })

  it('should return BasePermissionNotFoundError if LoadBasePermission returns undefined', async () => {
    basePermissionRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual(new BasePermissionNotFoundError('ANY_PERMISSION_CODE'))
  })

  it('should call SavePermission with correct input', async () => {
    await sut.perform(grantPermissionInput)

    expect(permissionRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(permissionRepoSpy.save).toHaveBeenCalledWith(
      new UserPermission({
        id: 'any_uuid',
        grantByUserId: 'any_user_id',
        grantToUserId: 'any_target_user_id',
        code: 'ANY_PERMISSION_CODE',
        read: true,
        write: true,
        owner: false,
        moduleId: 'any_module_id',
        grantAtOrganizationId: 'any_organization_id',
        description: 'any_permission_description',
        name: 'any_permission_name',
        expiration: new Date('2021-03-01T10:00:00'),
      })
    )
  })

  it('should return correct output on success', async () => {
    const output = await sut.perform(grantPermissionInput)

    expect(output).toEqual({ id: 'any_uuid' })
  })
})
