import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadOrganization, SaveOrganization } from '@/domain/contracts/repos'
import { PgOrganization } from '@/infra/repos/postgres/entities'
import { PgUser } from './entities/user'

export class PgOrganizationRepository
  extends PgRepository
  implements LoadOrganization, SaveOrganization
{
  public async load({ id }: LoadOrganization.Input): Promise<LoadOrganization.Output> {
    const orgsRepo = this.getRepository(PgOrganization)
    const orgs = await orgsRepo.findOne({ id })

    if (orgs !== undefined) {
      return { id: String(orgs!.id), name: orgs!.name }
    }
  }

  public async save(params: SaveOrganization.Input): Promise<SaveOrganization.Output> {
    const userRepo = this.getRepository(PgUser)
    let user = await userRepo.findOne({ id: params.ownerUserId })

    if (user === undefined) {
      throw new Error()
    }

    const orgsRepo = this.getRepository(PgOrganization)
    const pgOrg = orgsRepo.create({
      name: params.name,
      ...params.address,
      ownerUser: Promise.resolve(user),
    })

    user.organizations = Promise.resolve([pgOrg])

    user = await userRepo.save(user)

    // const id = await orgsRepo.save(pgOrg)
    const idReturn = (await user.organizations)[0]

    return { id: 'idReturn' }
  }
}
