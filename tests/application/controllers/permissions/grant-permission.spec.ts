import { GrantPermissionController } from '@/application/controllers/permissions'
import { GrantPermission } from '@/domain/use-cases/permissions'
import { mock } from 'jest-mock-extended'

describe('GrantPermissionController', () => {
  it('should call GrantPermission with correct input', async () => {
    const grantPermissionSpy = mock<GrantPermission>()
    const sut = new GrantPermissionController(grantPermissionSpy)

    await sut.perform({
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
})
