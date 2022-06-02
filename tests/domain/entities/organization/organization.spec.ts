import { Organization } from '@/domain/entities/organization/organization'

type organizationDataType = {
  id?: string
  name: string
  address: {
    city: string
    state: string
    country: string
    street: string
    neighbourhood: string
    buildingNumber: number
  }
  userId: string
}

type organizationReturnDataType = {
  id?: string
  name: string
  address: {
    city: string
    state: string
    country: string
    street: string
    neighbourhood: string
    buildingNumber: number
  }
  ownerUserId: string
}

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
}

describe('Organization', () => {
  let sut: Organization
  const organizationSutData: organizationDataType = { ...organizationData, userId: 'any_user_id' }
  const organizationReturnData: organizationReturnDataType = {
    ...organizationData,
    ownerUserId: 'any_user_id',
  }

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
