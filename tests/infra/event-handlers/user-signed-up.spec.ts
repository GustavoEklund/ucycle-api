import { UserSignedUpEvent } from '@/domain/events/user'
import { RequestContactVerification } from '@/domain/contracts/gateways'
import { UserSignedUpHandler } from '@/infra/event-handlers'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockUser } from '@/tests/domain/mocks/entities'
import { User } from '@/domain/entities/user'

describe('UserSignedUpEventHandler', () => {
  let sut: UserSignedUpHandler
  let userStub: User
  let userSignedUpEvent: UserSignedUpEvent
  let contactGatewaySpy: MockProxy<RequestContactVerification>

  beforeAll(() => {
    userStub = mockUser()
    userSignedUpEvent = new UserSignedUpEvent({ user: userStub })
    contactGatewaySpy = mock()
  })

  beforeEach(() => {
    sut = new UserSignedUpHandler(contactGatewaySpy)
  })

  it('should call RequestContactVerification with correct input', async () => {
    const expectedContact = userStub.account.getPrimaryPhone()

    await sut.handle(userSignedUpEvent)

    expect(contactGatewaySpy.requestVerification).toHaveBeenCalledTimes(1)
    expect(contactGatewaySpy.requestVerification).toHaveBeenCalledWith(expectedContact)
  })
})
