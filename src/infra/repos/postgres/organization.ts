import { Organization } from '@/domain/entities'
import { LoadOrganization, LoadOrganizations, SaveOrganization } from '@/domain/contracts/repos'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

export class PgOrganizationRepository
  extends PgRepository
  implements LoadOrganization, SaveOrganization, LoadOrganizations
{
  public async load({ id }: LoadOrganization.Input): Promise<LoadOrganization.Output> {
    const organizationRepo = this.getRepository(PgOrganization)
    const pgOrganization = await organizationRepo.findOne(
      { id },
      { relations: ['ownerUser', 'address'] }
    )
    if (pgOrganization !== undefined) {
      return new Organization({
        id: pgOrganization.id,
        name: pgOrganization.name,
        address: {
          city: pgOrganization.address.city,
          buildingNumber: String(pgOrganization.address.buildingNumber),
          street: pgOrganization.address.street,
          country: pgOrganization.address.country,
          state: pgOrganization.address.state,
          neighbourhood: pgOrganization.address.neighbourhood,
        },
        description: '',
        userId: pgOrganization.ownerUser.id,
      })
    }
  }

  public async save(params: SaveOrganization.Input): Promise<SaveOrganization.Output> {
    const userRepo = this.getRepository(PgUser)
    const pgUser = await userRepo.findOne(params.ownerUserId)
    if (pgUser === undefined) {
      throw new Error()
    }
    const organizationRepo = this.getRepository(PgOrganization)
    const { id } = await organizationRepo.save({
      name: params.name,
      ...params.address,
      ownerUser: pgUser,
    })
    return { id }
  }

  public async loadAll({ userId }: LoadOrganizations.Input): Promise<LoadOrganizations.Output> {
    const organizationRepo = this.getRepository(PgOrganization)
    const pgOrganizations = await organizationRepo.find({
      where: { ownerUser: { id: userId } },
      relations: ['ownerUser', 'address', 'pictures'],
    })
    return Promise.all(
      pgOrganizations.map(async (pgOrganization) => {
        const pictures = await pgOrganization.pictures
        const address = pgOrganization.address
        return {
          id: pgOrganization.id,
          name: pgOrganization.name,
          address: {
            city: address.city,
            buildingNumber: String(address.buildingNumber),
            street: address.street,
            postalCode: address.zipCode,
            neighbourhood: address.neighbourhood,
            country: address.country,
            state: address.state,
          },
          pictures: pictures.map((picture) => ({
            url: picture.url,
          })),
        }
      })
    )
  }
}
