import { SaveOrganization, LoadOrganization } from '@/domain/contracts/repos'
import { AlreadyExistsError } from '@/domain/entities/errors'
import { Organization } from '@/domain/entities'

type Input = {
  name: string
  address: object
  ownerUserId: number
}

type Output = void

export type AddOrganizations = (params: Input) => Promise<Output>
type Setup = (organizationsRepo: SaveOrganization & LoadOrganization) => AddOrganizations

export const setupAddOrganizations: Setup = (organizationsRepo) => {
  return async ({ name, address, ownerUserId }) => {
    const organization = new Organization({ name, address, ownerUserId })
    await organizationsRepo.save({
      name: organization.name,
      address: organization.address,
      ownerUserId: organization.ownerUserId,
    })
  }
}
