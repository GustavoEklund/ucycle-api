import { RevokePermission } from '@/domain/use-cases/permissions'
import { Controller, RevokePermissionController } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'

describe('RevokePermissionController', () => {
  let revokePermissionSpy: MockProxy<RevokePermission>
  let sut: RevokePermissionController

  beforeAll(() => {
    revokePermissionSpy = mock()
  })

  beforeEach(() => {
    sut = new RevokePermissionController(revokePermissionSpy)
  })

  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call RevokePermission with correct input', async () => {
    await sut.handle({
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
