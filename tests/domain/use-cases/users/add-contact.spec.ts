import { AddContact, AddContactUseCase } from '@/domain/use-cases/users/add-contact'
import { LoadContact, SaveContact } from '@/domain/contracts/repos'
import { ContactAlreadyExistsError } from '@/domain/entities/errors/contact'
import { Contact, ContactFromRawValueFactory } from '@/domain/entities/contact'
import { Publisher } from '@/domain/events'
import { ContactAddedEvent } from '@/domain/events/user'
import { mockContact } from '@/tests/domain/mocks/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('AddContactUseCase', () => {
  let sut: AddContactUseCase
  let contactRepositorySpy: MockProxy<LoadContact & SaveContact>
  let contactFactoryStub: MockProxy<ContactFromRawValueFactory>
  let inputStub: AddContact.Input
  let contactStub: Contact

  beforeAll(() => {
    inputStub = {
      contact: {
        value: 'any_contact',
        label: 'any_label',
        isPrivate: false,
      },
      user: {
        id: 'any_id',
      },
    }
    contactRepositorySpy = mock()
    contactRepositorySpy.load.mockResolvedValue(undefined)
    contactStub = mockContact({ userId: 'any_id' })
    contactFactoryStub = mock()
    contactFactoryStub.fromRawValue.mockReturnValue(contactStub)
  })

  beforeEach(() => {
    sut = new AddContactUseCase(contactRepositorySpy, contactFactoryStub)
  })

  it('should extends Publisher', () => {
    expect(sut).toBeInstanceOf(Publisher)
  })

  it('should call LoadContact with correct input', async () => {
    await sut.perform(inputStub)

    expect(contactRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(contactRepositorySpy.load).toHaveBeenCalledWith({ value: 'any_contact' })
  })

  it('should return ContactAlreadyExistsError if LoadContact returns a Contact', async () => {
    const expectedOutput = new ContactAlreadyExistsError('any_contact')
    contactRepositorySpy.load.mockResolvedValueOnce(mockContact())

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should call SaveContact with correct input', async () => {
    await sut.perform(inputStub)

    expect(contactRepositorySpy.save).toHaveBeenCalledTimes(1)
    expect(contactRepositorySpy.save).toHaveBeenCalledWith(contactStub)
    expect(contactRepositorySpy.save).toHaveBeenCalledAfter(contactRepositorySpy.load)
  })

  it('should call notify with correct input on success', async () => {
    const expectedEvent = new ContactAddedEvent({ contact: contactStub })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform(inputStub)

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenCalledWith(expectedEvent)
    expect(notifySpy).toHaveBeenCalledAfter(contactRepositorySpy.save)
  })
})
