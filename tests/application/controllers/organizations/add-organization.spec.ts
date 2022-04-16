import { AddOrganizationsController, Controller } from '@/application/controllers'
import { AddOrganizations } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'
import { ServerError, UnauthorizedError } from '@/application/errors/http'
import { AuthenticationError } from '@/domain/entities/errors/authentication'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}

const MockBeforeAllAddress = {
  city: 'any_city',
  state: 'any_state',
  country: 'any_country',
  street: 'any_street',
  neighbourhood: 'any_neighbourhood',
  buildingNumber: 0,
}

describe('AddOrganizationsController', () => {
  let address: Address
  let name: string
  let userId: string

  let sut: AddOrganizationsController
  let AddOrganizationsSpy: jest.Mock

  beforeAll(() => {
    address = MockBeforeAllAddress
    name = 'any_name'
    userId = 'any_user_id'

    AddOrganizationsSpy = jest.fn()
    AddOrganizationsSpy.mockResolvedValue({ id: 'any_id' })
  })

  beforeEach(() => {
    sut = new AddOrganizationsController(AddOrganizationsSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call AddOrganizations with correct input', async () => {
    await sut.handle({ name, address, userId })

    expect(AddOrganizationsSpy).toHaveBeenCalledWith({ name, address, userId })
    expect(AddOrganizationsSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    AddOrganizationsSpy.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ name, address, userId })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    })
  })

  it('should return 401 (UNAUTHORIZED) on Auth error', async () => {
    const error = new AuthenticationError()
    AddOrganizationsSpy.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ name, address, userId })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    })
  })
  it('should return 200 authentication succeeds', async () => {
    const httpResponse = await sut.handle({ name, address, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { id: 'any_id' },
    })
  })
})
