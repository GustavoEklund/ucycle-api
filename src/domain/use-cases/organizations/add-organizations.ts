import { SaveOrganization, LoadOrganization } from '@/domain/contracts/repos'
import { Organization } from '@/domain/entities'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}

type Input = {
  name: string
  address: Address
  userId: number
}

type Output = {
  id: string
}

export type AddOrganizations = (params: Input) => Promise<Output>
type Setup = (organizationsRepo: SaveOrganization) => AddOrganizations

export const setupAddOrganizations: Setup = (organizationsRepo) => {
  return async ({ name, address, userId }) => {
    const organization = new Organization({ name, address, userId })
    const response = await organizationsRepo.save({
      name: organization.name,
      address: {
        city: organization.address.city,
        state: organization.address.state,
        country: organization.address.country,
        street: organization.address.street,
        neighbourhood: organization.address.neighbourhood,
        buildingNumber: organization.address.buildingNumber,
      },
      ownerUserId: organization.ownerUserId,
    })

    return response
  }
}
