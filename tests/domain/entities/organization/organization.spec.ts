import { Organization } from '@/domain/entities/organization/organization'

describe('Organization', () => {
  let sut: Organization
  const organizationData = {
    id: 'any_id',
    name: 'any_name',
    address: {
      city: 'any_city',
      state: 'any_state',
      country: 'any_country',
      street: 'any_street',
      neighbourhood: 'any_neighbourhood',
      buildingNumber: '1',
    },
    userId: 'any_user_id',
  }

  beforeEach(() => {
    sut = new Organization(organizationData)
  })

  it('should begin correct properties', () => {
    expect(sut).toMatchObject({
      id: 'any_id',
      name: 'any_name',
      address: {
        city: 'any_city',
        state: 'any_state',
        country: 'any_country',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        buildingNumber: '1',
      },
      ownerUserId: 'any_user_id',
    })
  })
})
