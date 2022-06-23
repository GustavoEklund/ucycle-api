import { Controller, GrantPermissionController } from '@/application/controllers'
import { RequiredBoolean, RequiredString } from '@/application/validation'
import { BasePermissionNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'
import { GrantPermission } from '@/domain/use-cases/permissions'
import { notFound, ok } from '@/application/helpers'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GrantPermissionController', () => {
  let grantPermissionSpy: MockProxy<GrantPermission>
  let sut: GrantPermissionController
  let httpRequestStub: GrantPermission.Input

  beforeAll(() => {
    grantPermissionSpy = mock()
    grantPermissionSpy.perform.mockResolvedValue({
      id: 'any_permission_id',
    })
    httpRequestStub = {
      grantById: 'any_user_id',
      grantToId: 'any_grant_to_id',
      code: 'any_code',
      read: false,
      write: false,
      owner: false,
      moduleId: 'any_module_id',
      organizationId: 'any_organization_id',
    }
  })

  beforeEach(() => {
    sut = new GrantPermissionController(grantPermissionSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'grantById'),
      new RequiredString('any_grant_to_id', 'grantToId'),
      new RequiredString('any_code', 'code'),
      new RequiredBoolean(false, 'read'),
      new RequiredBoolean(false, 'write'),
      new RequiredBoolean(false, 'owner'),
      new RequiredString('any_module_id', 'moduleId'),
      new RequiredString('any_organization_id', 'organizationId'),
    ]

    const validators = sut.buildValidators(httpRequestStub)

    expect(validators).toEqual(expectedValidators)
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
      moduleId: 'any_module_id',
      organizationId: 'any_organization_id',
    })
  })

  it('should return 404 if GrantPermission return UserAccountNotFoundError', async () => {
    const expectedError = new UserAccountNotFoundError('any_user_id')
    const expectedHttpResponse = notFound([expectedError])
    grantPermissionSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.perform(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 404 if GrantPermission return BasePermissionNotFoundError', async () => {
    const expectedError = new BasePermissionNotFoundError('any_code')
    const expectedHttpResponse = notFound([expectedError])
    grantPermissionSpy.perform.mockResolvedValueOnce(expectedError)

    const httpResponse = await sut.perform(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 200 on success', async () => {
    const expectedHttpResponse = ok({ id: 'any_permission_id' })

    const httpResponse = await sut.perform(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })
})
