import { Organization } from '@/domain/entities/organization/organization'

const organizationData = {
  id: 'any_id',
  name: 'any_name',
  address: {
    city: 'any_city',
    state: 'any_state',
    country: 'any_country',
    street: 'any_street',
    neighbourhood: 'any_neighbourhood',
    buildingNumber: 1,
  },
  description: 'any_description',
}

describe('Organization', () => {
  let sut: Organization
  const organizationSutData = { ...organizationData, userId: 'any_user_id' }
  const organizationReturnData = new Organization({
    ...organizationData,
    userId: 'any_user_id',
  })

  beforeAll(() => {
    sut = new Organization(organizationSutData)
  })

  it('should return correct id', () => {
    expect(sut.id).toBe('any_id')
  })

  it('should return correct data', () => {
    expect(sut).toEqual(organizationReturnData)
  })
})
