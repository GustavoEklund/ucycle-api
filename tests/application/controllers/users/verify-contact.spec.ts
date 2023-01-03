import { VerifyContact } from '@/domain/use-cases'
import { Controller, VerifyContactController } from '@/application/controllers'
import { RequiredString } from '@/application/validation'

import { mock, MockProxy } from 'jest-mock-extended'
import {
  ContactDoesNotBelongToUserError,
  ContactNotFoundError,
  InvalidPhoneNumberVerificationCodeError,
} from '@/domain/entities/errors/contact'
import { UserNotFoundError } from '@/domain/entities/errors/user'

type HttpRequest = {
  userId: string
  contact: {
    value: string
    verificationCode: string
  }
}

describe('VerifyContactController', () => {
  let sut: VerifyContactController
  let verifyContactSpy: MockProxy<VerifyContact>
  let httpRequestStub: HttpRequest

  beforeAll(() => {
    httpRequestStub = {
      userId: 'any_user_id',
      contact: {
        value: 'any_contact_value',
        verificationCode: 'any_verification_code',
      },
    }
    verifyContactSpy = mock()
    verifyContactSpy.perform.mockResolvedValue(undefined)
  })

  beforeEach(() => {
    sut = new VerifyContactController(verifyContactSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'userId'),
      new RequiredString('any_contact_value', 'contact.value'),
      new RequiredString('any_verification_code', 'contact.verificationCode'),
    ]

    const validators = sut.buildValidators(httpRequestStub)

    expect(validators).toEqual(expectedValidators)
  })

  it('should call VerifyContact with correct input', async () => {
    await sut.handle(httpRequestStub)

    expect(verifyContactSpy.perform).toHaveBeenCalledTimes(1)
    expect(verifyContactSpy.perform).toHaveBeenCalledWith({
      user: {
        id: 'any_user_id',
      },
      contact: {
        value: 'any_contact_value',
        verificationCode: 'any_verification_code',
      },
    })
  })

  it('should return 404 if VerifyContact returns UserNotFoundError', async () => {
    const error = new UserNotFoundError('any_user_error')
    const expectedHttpResponse = { statusCode: 404, data: [error] }
    verifyContactSpy.perform.mockResolvedValueOnce(error)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 404 if VerifyContact returns ContactNotFoundError', async () => {
    const error = new ContactNotFoundError('any_contact_value')
    const expectedHttpResponse = { statusCode: 404, data: [error] }
    verifyContactSpy.perform.mockResolvedValueOnce(error)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 403 if VerifyContact returns ContactDoesNotBelongToUserError', async () => {
    const error = new ContactDoesNotBelongToUserError('any_contact_value', 'any_user_id')
    const expectedHttpResponse = { statusCode: 403, data: [error] }
    verifyContactSpy.perform.mockResolvedValueOnce(error)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 400 if VerifyContact returns InvalidPhoneNumberVerificationCodeError', async () => {
    const error = new InvalidPhoneNumberVerificationCodeError('any_verification_code')
    const expectedHttpResponse = { statusCode: 400, data: [error] }
    verifyContactSpy.perform.mockResolvedValueOnce(error)

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })

  it('should return 204 on success', async () => {
    const expectedHttpResponse = { statusCode: 204, data: undefined }

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })
})
