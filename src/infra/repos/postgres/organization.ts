import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadOrganization, SaveOrganization } from '@/domain/contracts/repos'
import { PgOrganization } from '@/infra/repos/postgres/entities'
import { PgUser } from './entities/user'

export class PgOrganizationRepository
  extends PgRepository
  implements LoadOrganization, SaveOrganization
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
}
