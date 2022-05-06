import { ApplyToJoinOrganizationController, Controller } from '@/application/controllers'
import { ApplyToJoinOrganization } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

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

  it('should call ApplyToJoinOrganization with correct input', async () => {
    await sut.handle({ userId: 'userId', organizationId: 'organizationId' })

    expect(applyToJoinOrganizationSpy.perform).toHaveBeenCalledTimes(1)
    expect(applyToJoinOrganizationSpy.perform).toHaveBeenCalledWith({
      userId: 'userId',
      organizationId: 'organizationId',
    })
  })
})
