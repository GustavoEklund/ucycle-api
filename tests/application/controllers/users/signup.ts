import { SignUpController, Controller } from '@/application/controllers'
import { mock, MockProxy } from 'jest-mock-extended'
import { SignUp } from '@/domain/use-cases'

type HttpRequest = {
  name: string
  email: string
  phone: string
  document: string
  password: string
  socialName: string
}

describe('AddPersonsController', () => {
  let sut: SignUpController
  let userMockSpy: MockProxy<SignUp>
  let inputStub: HttpRequest

  beforeAll(() => {
    inputStub = {
      name: 'any_name',
      phone: 'any_phone_number',
      email: 'any_email',
      document: 'any_cpf',
      password: 'any_password',
      socialName: 'any_social_name',
    }
    userMockSpy = mock()
  })

  beforeEach(() => {
    sut = new SignUpController(userMockSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call SignUp with correct values', async () => {
    await sut.handle(inputStub)

    expect(userMockSpy).toHaveBeenCalledTimes(1)
    expect(userMockSpy).toHaveBeenCalledWith(inputStub)
  })

  it('should return undefined on success', async () => {
    const response = await sut.handle(inputStub)

    expect(response).toEqual({
      statusCode: 200,
      data: undefined,
    })
  })
})
