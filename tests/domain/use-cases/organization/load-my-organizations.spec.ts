import { LoadMyOrganizationsUseCase } from '@/domain/use-cases'
import { LoadOrganizations } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

describe('LoadMyOrganizationsUseCase', () => {
  let userId: string
  let sut: LoadMyOrganizationsUseCase
  let organizationRepoSpy: MockProxy<LoadOrganizations>

  beforeAll(() => {
    userId = 'userId'
    organizationRepoSpy = mock()
    organizationRepoSpy.loadAll.mockResolvedValue([
      {
        id: 'any_organization_id',
        name: 'any_organization_name',
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
    sut = new LoadMyOrganizationsUseCase(organizationRepoSpy)
  })

  it('should call LoadOrganizations with correct input', async () => {
    await sut.perform({ userId })

    expect(organizationRepoSpy.loadAll).toHaveBeenCalledWith({ userId })
  })

  it('should return the output of LoadOrganizations', async () => {
    const output = await sut.perform({ userId })

    expect(output).toEqual([
      {
        id: 'any_organization_id',
        name: 'any_organization_name',
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
})
