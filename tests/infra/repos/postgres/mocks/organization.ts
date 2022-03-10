import { SaveOrganization } from '@/domain/contracts/repos'

export const mockOrganization = (): SaveOrganization.Input => ({
  name: 'any_name',
  ownerUserId: '1',
  address: {
    city: 'any_city',
    state: 'any_state',
    country: 'any_country',
    street: 'any_street',
    neighbourhood: 'any_neighbourhood',
    buildingNumber: 0,
  },
})
