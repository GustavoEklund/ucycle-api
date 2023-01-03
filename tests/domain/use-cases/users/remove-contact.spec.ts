import { DeleteContact, LoadContact, LoadUserAccount } from '@/domain/contracts/repos'
import { RemoveContact, RemoveContactUseCase } from '@/domain/use-cases'
import { User } from '@/domain/entities/user'
import { Contact } from '@/domain/entities/contact'
import { Publisher } from '@/domain/events'
import { ContactRemovedEvent } from '@/domain/events/user'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'
import {
  ContactDoesNotBelongToUserError,
  ContactNotFoundError,
} from '@/domain/entities/errors/contact'
import { mockContact, mockPhoneContact, mockUser } from '@/tests/domain/mocks/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('RemoveContactUseCase', () => {
  let sut: RemoveContactUseCase
  let userRepositorySpy: MockProxy<LoadUserAccount>
  let contactRepositorySpy: MockProxy<LoadContact & DeleteContact>
  let inputStub: RemoveContact.Input
  let userStub: User
  let contactStub: Contact

  beforeAll(() => {
    inputStub = {
      user: { id: 'any_user_id' },
      contact: { id: 'any_contact_id' },
    }
    contactStub = mockPhoneContact({ userId: 'any_user_id' })
    userStub = mockUser({ id: 'any_user_id', phones: [contactStub] })
    userRepositorySpy = mock()
    userRepositorySpy.load.mockResolvedValue(userStub)
    contactRepositorySpy = mock()
    contactRepositorySpy.load.mockResolvedValue(contactStub)
  })

  beforeEach(() => {
    sut = new RemoveContactUseCase(userRepositorySpy, contactRepositorySpy)
  })

  it('should extends Publisher', () => {
    expect(sut).toBeInstanceOf(Publisher)
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(userRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserAccountNotFoundError if LoadUserAccount returns undefined', async () => {
    const expectedError = new UserAccountNotFoundError('any_user_id')
    userRepositorySpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedError)
  })

  it('should call LoadContact with correct input', async () => {
    await sut.perform(inputStub)

    expect(contactRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(contactRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_contact_id' })
    expect(contactRepositorySpy.load).toHaveBeenCalledAfter(userRepositorySpy.load)
  })

  it('should return ContactNotFoundError if LoadContact returns undefined', async () => {
    const expectedError = new ContactNotFoundError()
    contactRepositorySpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedError)
  })

  it('should return ContactDoesNotBelongToUserError if contact does not belong to user', async () => {
    const otherContact = mockContact()
    contactRepositorySpy.load.mockResolvedValueOnce(otherContact)
    const expectedError = new ContactDoesNotBelongToUserError(
      otherContact.getFullPlainValue(),
      'any_user_id'
    )

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedError)
  })

  it('should call DeleteContact with correct input', async () => {
    await sut.perform(inputStub)

    expect(contactRepositorySpy.delete).toHaveBeenCalledTimes(1)
    expect(contactRepositorySpy.delete).toHaveBeenCalledWith(contactStub)
    expect(contactRepositorySpy.delete).toHaveBeenCalledAfter(contactRepositorySpy.load)
  })

  it('should call notify with correct input', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-03-01T10:00:00'))
    const expectedEvent = new ContactRemovedEvent({ contact: contactStub, user: userStub })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform(inputStub)

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenCalledWith(expectedEvent)
    expect(notifySpy).toHaveBeenCalledAfter(contactRepositorySpy.delete)
  })
})
