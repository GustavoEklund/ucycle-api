import { VerifyContact, VerifyContactUseCase } from '@/domain/use-cases'
import { LoadContact, LoadUserAccount, SaveContact } from '@/domain/contracts/repos'
import { VerifyContact as VerifyContactGateway } from '@/domain/contracts/gateways'
import { Contact, Email, Phone } from '@/domain/entities/contact'
import { User } from '@/domain/entities/user'
import { ContactVerifiedEvent } from '@/domain/events/user'
import {
  ContactAlreadyVerifiedError,
  ContactDoesNotBelongToUserError,
  ContactNotFoundError,
  InvalidPhoneNumberVerificationCodeError,
} from '@/domain/entities/errors/contact'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { mockContact, mockUser } from '@/tests/domain/mocks/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('VerifyContactUseCase', () => {
  let inputStub: VerifyContact.Input
  let sut: VerifyContactUseCase
  let userAccountRepositorySpy: MockProxy<LoadUserAccount>
  let contactRepositorySpy: MockProxy<LoadContact & SaveContact>
  let contactGatewaySpy: MockProxy<VerifyContactGateway>
  let contactStub: Contact
  let userStub: User

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-03-01T10:00:00'))
  })

  beforeEach(() => {
    contactStub = mockContact({ verified: false })
    userStub = mockUser({
      phones: contactStub instanceof Phone ? [contactStub] : [],
      emails: contactStub instanceof Email ? [contactStub] : [],
    })
    inputStub = {
      user: { id: userStub.id },
      contact: {
        value: contactStub.getFullPlainValue(),
        verificationCode: 'any_verification_code',
      },
    }
    userAccountRepositorySpy = mock()
    userAccountRepositorySpy.load.mockResolvedValue(userStub)
    contactRepositorySpy = mock()
    contactRepositorySpy.load.mockResolvedValue(contactStub)
    contactGatewaySpy = mock()
    contactGatewaySpy.verify.mockResolvedValue({ didVerificationSucceed: true })
    sut = new VerifyContactUseCase(
      userAccountRepositorySpy,
      contactRepositorySpy,
      contactGatewaySpy
    )
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform(inputStub)

    expect(userAccountRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepositorySpy.load).toHaveBeenCalledBefore(contactRepositorySpy.load)
    expect(userAccountRepositorySpy.load).toHaveBeenCalledWith({ id: userStub.id })
  })

  it('should return UserNotFoundError if LoadUserAccount returns undefined', async () => {
    const expectedOutput = new UserNotFoundError(userStub.id)
    userAccountRepositorySpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should return ContactDoesNotBelongToUserError if contact does not belong to user', async () => {
    userStub = mockUser()
    userAccountRepositorySpy.load.mockResolvedValueOnce(userStub)
    const expectedOutput = new ContactDoesNotBelongToUserError(
      contactStub.getFullPlainValue(),
      userStub.id
    )

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should call LoadContact with correct input', async () => {
    await sut.perform(inputStub)

    expect(contactRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(contactRepositorySpy.load).toHaveBeenCalledAfter(userAccountRepositorySpy.load)
    expect(contactRepositorySpy.load).toHaveBeenCalledWith({
      value: contactStub.getFullPlainValue(),
    })
  })

  it('should return ContactNotFoundError if LoadContact returns undefined', async () => {
    contactRepositorySpy.load.mockResolvedValueOnce(undefined)
    const expectedOutput = new ContactNotFoundError(contactStub.getFullPlainValue())

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should return ContactAlreadyVerifiedError if contact is already verified', async () => {
    contactStub.verify()
    const expectedOutput = new ContactAlreadyVerifiedError(contactStub.getFullPlainValue())

    const output = await sut.perform({
      user: { id: userStub.id },
      contact: {
        value: contactStub.getFullPlainValue(),
        verificationCode: inputStub.contact.verificationCode,
      },
    })

    expect(output).toEqual(expectedOutput)
  })

  it('should call VerifyPhoneNumber with correct input', async () => {
    const verifySpy = jest.spyOn(contactStub, 'verify')

    await sut.perform({
      user: inputStub.user,
      contact: {
        value: contactStub.getFullPlainValue(),
        verificationCode: inputStub.contact.verificationCode,
      },
    })

    expect(contactGatewaySpy.verify).toHaveBeenCalledTimes(1)
    expect(contactGatewaySpy.verify).toHaveBeenCalledAfter(contactRepositorySpy.load)
    expect(verifySpy).toHaveBeenCalledAfter(contactGatewaySpy.verify)
    expect(contactGatewaySpy.verify).toHaveBeenCalledWith({
      contact: contactStub,
      code: 'any_verification_code',
    })
  })

  it('should return InvalidPhoneNumberVerificationCodeError if VerifyPhoneNumber fails', async () => {
    const expectedOutput = new InvalidPhoneNumberVerificationCodeError('any_verification_code')
    contactGatewaySpy.verify.mockResolvedValueOnce({ didVerificationSucceed: false })

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should call SaveContact with correct input', async () => {
    contactStub = mockContact({ verified: false })
    const verifySpy = jest.spyOn(contactStub, 'verify')
    contactRepositorySpy.load.mockResolvedValueOnce(contactStub)
    userStub = mockUser({
      phones: contactStub instanceof Phone ? [contactStub] : [],
      emails: contactStub instanceof Email ? [contactStub] : [],
    })
    userAccountRepositorySpy.load.mockResolvedValueOnce(userStub)

    await sut.perform(inputStub)

    expect(verifySpy).toHaveBeenCalledTimes(1)
    expect(verifySpy).toHaveBeenCalledBefore(contactRepositorySpy.save)
    expect(verifySpy).toHaveBeenCalledAfter(contactGatewaySpy.verify)
    expect(contactRepositorySpy.save).toHaveBeenCalledTimes(1)
    expect(contactRepositorySpy.save).toHaveBeenCalledWith(contactStub)
  })

  it('should call notify with correct input', async () => {
    const expectedEvent = new ContactVerifiedEvent({
      contact: contactStub,
      user: userStub,
    })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform(inputStub)

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenCalledWith(expectedEvent)
    expect(notifySpy).toHaveBeenCalledAfter(contactRepositorySpy.save)
  })
})
