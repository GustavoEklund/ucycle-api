import { RequestContactVerification } from '@/domain/contracts/gateways'
import { PhoneContactAddedEventHandler } from '@/infra/event-handlers'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockEmailContact, mockPhoneContact } from '@/tests/domain/mocks/entities'
import { ContactAddedEvent } from '@/domain/events/user'
import { Contact } from '@/domain/entities/contact'

describe('PhoneContactAddedEventHandler', () => {
  let sut: PhoneContactAddedEventHandler
  let contactGatewaySpy: MockProxy<RequestContactVerification>
  let contactVerifiedEventStub: ContactAddedEvent
  let contactStub: Contact

  beforeAll(() => {
    contactGatewaySpy = mock()
    contactStub = mockPhoneContact()
    contactVerifiedEventStub = new ContactAddedEvent({ contact: contactStub })
  })

  beforeEach(() => {
    sut = new PhoneContactAddedEventHandler(contactGatewaySpy)
  })

  it('should call RequestContactVerification with correct input', async () => {
    await sut.handle(contactVerifiedEventStub)

    expect(contactGatewaySpy.requestVerification).toHaveBeenCalledTimes(1)
    expect(contactGatewaySpy.requestVerification).toHaveBeenCalledWith(contactStub)
  })

  it('should not call RequestContactVerification if input.contact is not instance of Phone', async () => {
    const emailContactStub = mockEmailContact()
    const emailContactAddedEvent = new ContactAddedEvent({ contact: emailContactStub })

    await sut.handle(emailContactAddedEvent)

    expect(contactGatewaySpy.requestVerification).not.toHaveBeenCalled()
  })

  it('should throw if RequestContactVerification throws', async () => {
    const expectedError = new Error('any infra error')
    contactGatewaySpy.requestVerification.mockRejectedValueOnce(expectedError)

    const promise = sut.handle(contactVerifiedEventStub)

    await expect(promise).rejects.toThrow(expectedError)
  })
})
