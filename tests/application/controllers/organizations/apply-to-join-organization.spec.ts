import { ApplyToJoinOrganizationController, Controller } from '@/application/controllers'
import { ApplyToJoinOrganization } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredString } from '@/application/validation'
import {
  AlreadyAppliedToJoinOrganizationError,
  AlreadyMemberOfOrganizationError,
  OrganizationNotFoundError,
  TheOrganizationOwnerCanNotApplyToJoinOrganizationError,
  UserAccountNotFoundError,
} from '@/domain/entities/errors'
import { conflict, created, notFound, serverError } from '@/application/helpers'

describe('ApplyToJoinOrganizationController', () => {
  let sut: ApplyToJoinOrganizationController
  let applyToJoinOrganizationSpy: MockProxy<ApplyToJoinOrganization>

  beforeAll(() => {
    applyToJoinOrganizationSpy = mock()
  })

  beforeEach(() => {
    sut = new ApplyToJoinOrganizationController(applyToJoinOrganizationSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'userId'),
      new RequiredString('any_organization_id', 'organizationId'),
    ]

    const validators = sut.buildValidators({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(validators).toEqual(expectedValidators)
  })

  it('should call ApplyToJoinOrganization with correct input', async () => {
    await sut.handle({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(applyToJoinOrganizationSpy.perform).toHaveBeenCalledTimes(1)
    expect(applyToJoinOrganizationSpy.perform).toHaveBeenCalledWith({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })
  })

  it('should return 404 if ApplyToJoinOrganization throw UserAccountNotFoundError', async () => {
    const expectedError = new UserAccountNotFoundError('any_user_id')
    const expectedHttpResponse = notFound([expectedError])
    applyToJoinOrganizationSpy.perform.mockRejectedValueOnce(expectedError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 404 if ApplyToJoinOrganization throw OrganizationNotFoundError', async () => {
    const expectedError = new OrganizationNotFoundError('any_organization_id')
    const expectedHttpResponse = notFound([expectedError])
    applyToJoinOrganizationSpy.perform.mockRejectedValueOnce(expectedError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 409 if ApplyToJoinOrganization throw TheOrganizationOwnerCanNotApplyToJoinOrganizationError', async () => {
    const expectedError = new TheOrganizationOwnerCanNotApplyToJoinOrganizationError()
    const expectedHttpResponse = conflict([expectedError])
    applyToJoinOrganizationSpy.perform.mockRejectedValueOnce(expectedError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 409 if ApplyToJoinOrganization throw AlreadyAppliedToJoinOrganizationError', async () => {
    const expectedError = new AlreadyAppliedToJoinOrganizationError('any_organization_id')
    const expectedHttpResponse = conflict([expectedError])
    applyToJoinOrganizationSpy.perform.mockRejectedValueOnce(expectedError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 409 if ApplyToJoinOrganization throw AlreadyMemberOfOrganizationError', async () => {
    const expectedError = new AlreadyMemberOfOrganizationError('any_organization_id')
    const expectedHttpResponse = conflict([expectedError])
    applyToJoinOrganizationSpy.perform.mockRejectedValueOnce(expectedError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 500 if ApplyToJoinOrganization throws infra error', async () => {
    const anyError = new Error()
    const expectedHttpResponse = serverError(anyError)
    applyToJoinOrganizationSpy.perform.mockRejectedValueOnce(anyError)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 201 on success', async () => {
    const expectedHttpResponse = created(undefined)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })

    expect(httpResponse).toEqual(expectedHttpResponse)
  })
})
