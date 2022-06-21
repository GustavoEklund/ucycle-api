import { GrantPermissionController, Controller } from '@/application/controllers'
import { RequiredBoolean, RequiredString } from '@/application/validation'
import { GrantPermission } from '@/domain/use-cases/permissions'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GrantPermissionController', () => {
  let grantPermissionSpy: MockProxy<GrantPermission>
  let sut: GrantPermissionController
  let httpRequestStub: GrantPermission.Input
  beforeAll(() => {
    grantPermissionSpy = mock()
    httpRequestStub = {
      grantById: 'any_user_id',
      grantToId: 'any_grant_to_id',
      code: 'any_code',
      read: false,
      write: false,
      owner: false,
      status: 'any_status',
      moduleId: 'any_module_id',
      resourceId: 'any_resource_id',
    }
  })
  beforeEach(() => {
    sut = new GrantPermissionController(grantPermissionSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call GrantPermission with correct input', async () => {
    await sut.perform(httpRequestStub)

    expect(grantPermissionSpy.perform).toHaveBeenCalledTimes(1)
    expect(grantPermissionSpy.perform).toHaveBeenCalledWith({
      grantById: 'any_user_id',
      grantToId: 'any_grant_to_id',
      code: 'any_code',
      read: false,
      write: false,
      owner: false,
      status: 'any_status',
      moduleId: 'any_module_id',
      resourceId: 'any_resource_id',
    })
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'grantById'),
      new RequiredString('any_grant_to_id', 'grantToId'),
      new RequiredString('any_code', 'code'),
      new RequiredBoolean(false, 'read'),
      new RequiredBoolean(false, 'write'),
      new RequiredBoolean(false, 'owner'),
      new RequiredString('any_status', 'status'),
      new RequiredString('any_module_id', 'moduleId'),
      new RequiredString('any_resource_id', 'resourceId'),
    ]

    const validators = sut.buildValidators(httpRequestStub)

    expect(validators).toEqual(expectedValidators)
  })
})
