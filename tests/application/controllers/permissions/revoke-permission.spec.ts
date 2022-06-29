import { RevokePermission } from '@/domain/use-cases/permissions'
import { RevokePermissionController } from '@/application/controllers'

import { mock } from 'jest-mock-extended'

describe('RevokePermissionController', () => {
  it('should call RevokePermission with correct input', async () => {
    const revokePermissionSpy = mock<RevokePermission>()
    const sut = new RevokePermissionController(revokePermissionSpy)

    await sut.perform({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })

    expect(revokePermissionSpy.perform).toHaveBeenCalledWith({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })
  })
})
