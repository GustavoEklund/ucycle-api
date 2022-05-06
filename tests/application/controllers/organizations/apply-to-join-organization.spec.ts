import { ApplyToJoinOrganizationController, Controller } from '@/application/controllers'
import { ApplyToJoinOrganization } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredString } from '@/application/validation'

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
})
