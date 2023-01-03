import { Controller, SignUpController } from '@/application/controllers'
import { SignUp } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

type HttpRequest = {
  name: string
  email: string
  phone: string
  document: string
  password: string
  socialName: string
}

describe('SignUpController', () => {
  let sut: SignUpController
  let signupSpy: MockProxy<SignUp>
  let inputStub: HttpRequest

  beforeEach(() => {
    inputStub = {
      name: 'any_name',
      phone: 'any_phone_number',
      email: 'any_email',
      document: 'any_cpf',
      password: 'any_password',
      socialName: 'any_social_name',
    }
    signupSpy = mock()
    sut = new SignUpController(signupSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call SignUp with correct values', async () => {
    await sut.perform(inputStub)

    expect(signupSpy.perform).toHaveBeenCalledTimes(1)
    expect(signupSpy.perform).toHaveBeenCalledWith({
      account: {
        name: 'any_name',
        password: 'any_password',
        email: 'any_email',
        document: 'any_cpf',
        phone: 'any_phone_number',
      },
      profile: { socialName: 'any_social_name' },
    })
  })

  it('should return undefined on success', async () => {
    const response = await sut.perform(inputStub)

    expect(response).toEqual({
      statusCode: 200,
      data: undefined,
    })
  })
})
