import { AddContact } from '@/domain/use-cases'
import { AddContactController, Controller } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredBoolean, RequiredString } from '@/application/validation'

describe('AddContactController', () => {
  let sut: AddContactController
  let addContactSpy: MockProxy<AddContact>
  let httpRequestStub: {
    value: string
    label: string
    isPrivate: boolean
    userId: string
  }

  beforeAll(() => {
    httpRequestStub = {
      value: 'any_contact_value',
      label: 'any_contact_label',
      isPrivate: true,
      userId: 'any_user_id',
    }
    addContactSpy = mock()
  })

  beforeEach(() => {
    sut = new AddContactController(addContactSpy)
  })

  it('should extends Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'userId'),
      new RequiredString('any_contact_value', 'value'),
      new RequiredBoolean(true, 'isPrivate'),
      new RequiredString('any_contact_label', 'label'),
    ]

    const validators = sut.buildValidators(httpRequestStub)

    expect(validators).toEqual(expectedValidators)
  })

  it('should call AddContact with correct input', async () => {
    await sut.handle(httpRequestStub)

    expect(addContactSpy.perform).toHaveBeenCalledTimes(1)
    expect(addContactSpy.perform).toHaveBeenCalledWith({
      contact: {
        value: 'any_contact_value',
        label: 'any_contact_label',
        isPrivate: true,
      },
      user: { id: 'any_user_id' },
    })
  })

  it('should return 204 on success', async () => {
    const expectedHttpResponse = {
      statusCode: 204,
      data: undefined,
    }

    const httpResponse = await sut.handle(httpRequestStub)

    expect(httpResponse).toEqual(expectedHttpResponse)
  })
})
