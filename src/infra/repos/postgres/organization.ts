import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadOrganization, LoadOrganizations, SaveOrganization } from '@/domain/contracts/repos'
import { PgOrganization } from '@/infra/repos/postgres/entities'
import { PgUser } from './entities/user'

export class PgOrganizationRepository
  extends PgRepository
  implements LoadOrganization, SaveOrganization, LoadOrganizations
{
  public async load({ id }: LoadOrganization.Input): Promise<LoadOrganization.Output> {
    const organizationRepo = this.getRepository(PgOrganization)
    const organization = await organizationRepo.findOne({ id })
    if (organization !== undefined) {
      return { id: String(organization!.id), name: organization!.name }
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
        return {
          id: pgOrganization.id,
          name: pgOrganization.name,
          address: {
            city: pgOrganization.address.city,
            buildingNumber: pgOrganization.address.buildingNumber,
            street: pgOrganization.address.street,
            postalCode: pgOrganization.address.postalCode,
            neighbourhood: pgOrganization.address.neighbourhood,
            country: pgOrganization.address.country,
            state: pgOrganization.address.state,
          },
          pictures: pictures.map((picture) => ({
            url: picture.url,
          })),
        }
      })
    )
  }
}
