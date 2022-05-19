import { Organization } from '@/domain/entities/organization/organization'

describe('Organization', () => {
  let sut: Organization

  beforeAll(() => {
    sut = new Organization({
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
      userId: 'any_user_id',
    })
  })

  it('should return correct id', () => {
    expect(sut.id).toBe('any_id')
  })
})
