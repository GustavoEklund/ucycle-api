import { Controller, LoadMyOrganizationsController } from '@/application/controllers'
import { LoadMyOrganizations } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredString } from '@/application/validation'

describe('LoadMyOrganizationsController', () => {
  let userId: string
  let sut: LoadMyOrganizationsController
  let loadMyOrganizationsSpy: MockProxy<LoadMyOrganizations>

  beforeAll(() => {
    userId = 'any_user_id'
    loadMyOrganizationsSpy = mock()
    loadMyOrganizationsSpy.perform.mockResolvedValue([
      {
        id: 'any_id',
        name: 'any_name',
        address: {
          city: 'any_city',
          state: 'any_state',
          country: 'any_country',
          street: 'any_street',
          neighbourhood: 'any_neighbourhood',
          buildingNumber: 72,
        },
        pictures: [
          {
            url: 'any_url',
          },
        ],
      },
    ])
  })

  beforeEach(() => {
    sut = new LoadMyOrganizationsController(loadMyOrganizationsSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators correctly', () => {
    const expectedValidators = [new RequiredString('any_user_id', 'userId')]

    const validators = sut.buildValidators({ userId })

    expect(validators).toEqual(expectedValidators)
  })

  it('should call LoadMyOrganizations with correct input', async () => {
    await sut.handle({ userId })

    expect(loadMyOrganizationsSpy.perform).toHaveBeenCalledTimes(1)
    expect(loadMyOrganizationsSpy.perform).toHaveBeenCalledWith({ userId })
  })

  it('should return 200 with a list of organizations on success', async () => {
    const output = await sut.handle({ userId })

    expect(output).toEqual({
      data: [
        {
          id: 'any_id',
          name: 'any_name',
          address: {
            city: 'any_city',
            state: 'any_state',
            country: 'any_country',
            street: 'any_street',
            neighbourhood: 'any_neighbourhood',
            buildingNumber: 72,
          },
          pictures: [
            {
              url: 'any_url',
            },
          ],
        },
      ],
      statusCode: 200,
    })
  })
})
