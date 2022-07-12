import { AddOrganizationsController, Controller } from '@/application/controllers'
import { RequiredInteger, RequiredString } from '@/application/validation'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}

describe('AddOrganizationsController', () => {
  let address: Address
  let name: string
  let userId: string
  let sut: AddOrganizationsController
  let addOrganizationsSpy: jest.Mock
  let description: string

  beforeAll(() => {
    address = {
      city: 'any_city',
      state: 'any_state',
      country: 'any_country',
      street: 'any_street',
      neighbourhood: 'any_neighbourhood',
      buildingNumber: 72,
    }
    name = 'any_name'
    userId = 'any_user_id'
    description = 'any_description'
    addOrganizationsSpy = jest.fn()
    addOrganizationsSpy.mockResolvedValue({ id: 'any_id' })
  })

  beforeEach(() => {
    sut = new AddOrganizationsController(addOrganizationsSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [
      new RequiredString('any_user_id', 'userId'),
      new RequiredString('any_name', 'name'),
      new RequiredString('any_city', 'address.city'),
      new RequiredString('any_state', 'address.state'),
      new RequiredString('any_country', 'address.country'),
      new RequiredString('any_street', 'address.street'),
      new RequiredString('any_neighbourhood', 'address.neighbourhood'),
      new RequiredInteger(72, 'address.buildingNumber'),
    ]

    const validators = sut.buildValidators({ name, address, userId, description })

    expect(validators).toEqual(expectedValidators)
  })

  it('should call AddOrganizations with correct input', async () => {
    await sut.handle({ name, address, userId })

    expect(addOrganizationsSpy).toHaveBeenCalledWith({ name, address, userId })
    expect(addOrganizationsSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 200 authentication succeeds', async () => {
    const httpResponse = await sut.handle({ name, address, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { id: 'any_id' },
    })
  })
})
