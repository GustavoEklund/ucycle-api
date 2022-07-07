import { SaveOrganization } from '@/domain/contracts/repos'
import { Organization } from '@/domain/entities'
import { UUIDGenerator } from '@/domain/contracts/gateways'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: string
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
type Setup = (organizationsRepo: SaveOrganization, crypto: UUIDGenerator) => AddOrganizations

export const setupAddOrganizations: Setup = (organizationsRepo, crypto) => {
  return async ({ name, address, userId }) => {
    const organization = new Organization({ id: crypto.uuid(), name, address, userId })
    return await organizationsRepo.save({
      name: organization.name,
      address: organization.address,
      ownerUserId: organization.ownerUserId,
    })
  }
}
