import { UUIDGenerator } from '@/domain/contracts/gateways'
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
  description: string
}

type Output = {
  id: string
}

export type AddOrganizations = (params: Input) => Promise<Output>
type Setup = (organizationsRepo: SaveOrganization, crypto: UUIDGenerator) => AddOrganizations

export const setupAddOrganizations: Setup = (organizationsRepo, crypto) => {
  return async ({ name, address, userId, description }) => {
    const organization = new Organization({ id: crypto.uuid(), name, address, userId, description })
    return await organizationsRepo.save(organization)
  }
}
