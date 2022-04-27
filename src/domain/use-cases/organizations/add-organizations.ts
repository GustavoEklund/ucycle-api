import { SaveOrganization } from '@/domain/contracts/repos'
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
  userId: string
}

type Output = {
  id: string
}

export type AddOrganizations = (params: Input) => Promise<Output>
type Setup = (organizationsRepo: SaveOrganization) => AddOrganizations

export const setupAddOrganizations: Setup = (organizationsRepo) => {
  return async ({ name, address, userId }) => {
    const organization = new Organization({ name, address, userId })
    return await organizationsRepo.save({
      name: organization.name,
      address: organization.address,
      ownerUserId: organization.ownerUserId,
    })
  }
}
