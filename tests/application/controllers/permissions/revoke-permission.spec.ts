import { RevokePermission } from '@/domain/use-cases/permissions'
import { Controller, HttpRequest, RevokePermissionController } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredString } from '@/application/validation'
import { UserNotFoundError, UserPermissionNotFoundError } from '@/domain/entities/errors'

describe('RevokePermissionController', () => {
  let revokePermissionSpy: MockProxy<RevokePermission>
  let sut: RevokePermissionController
  let httpRequest: HttpRequest

  beforeAll(() => {
    httpRequest = {
      userId: 'any_user_id',
      targetUserId: 'any_target_user_id',
      permissionId: 'any_permission_id',
    }
    revokePermissionSpy = mock()
  })

  beforeEach(() => {
    sut = new RevokePermissionController(revokePermissionSpy)
  })

  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'userId'),
      new RequiredString('any_target_user_id', 'targetUserId'),
      new RequiredString('any_permission_id', 'permissionId'),
    ]

    const validators = sut.buildValidators(httpRequest)

    expect(validators).toEqual(expectedValidators)
  })

  it('should call RevokePermission with correct input', async () => {
    await sut.handle(httpRequest)

    expect(revokePermissionSpy.perform).toHaveBeenCalledTimes(1)
    expect(revokePermissionSpy.perform).toHaveBeenCalledWith({
      user: { id: 'any_user_id' },
      targetUser: {
        id: 'any_target_user_id',
        permission: { id: 'any_permission_id' },
      },
    })
  })

  it('should return 404 if RevokePermission returns UserNotFoundError', async () => {
    revokePermissionSpy.perform.mockResolvedValueOnce(new UserNotFoundError('any_user_id'))

    const output = await sut.handle(httpRequest)

    expect(output).toEqual({
      statusCode: 404,
      data: [new UserNotFoundError('any_user_id')],
    })
  })

  it('should return 404 if RevokePermission returns UserPermissionNotFound', async () => {
    revokePermissionSpy.perform.mockResolvedValueOnce(
      new UserPermissionNotFoundError('any_permission_id')
    )

    const output = await sut.handle(httpRequest)

    expect(output).toEqual({
      statusCode: 404,
      data: [new UserPermissionNotFoundError('any_permission_id')],
    })
  })

  it('should return 204 if RevokePermission returns undefined on success', async () => {
    const output = await sut.handle(httpRequest)

    expect(output).toEqual({
      statusCode: 204,
      data: undefined,
    })
  })
})
