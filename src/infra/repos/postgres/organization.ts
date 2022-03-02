import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadOrganization, SaveOrganization } from '@/domain/contracts/repos'
import { PgOrganization } from '@/infra/repos/postgres/entities'

export class PgOrganizationRepository
  extends PgRepository
  implements LoadOrganization, SaveOrganization
{
  public async load({ id }: LoadOrganization.Input): Promise<LoadOrganization.Output> {
    const orgsRepo = this.getRepository(PgOrganization)
    const orgs = await orgsRepo.findOne({ id: Number(id) })

    if (orgs !== undefined) {
      return { id: String(orgs!.id), name: orgs!.name }
    }
  }

  public async save({ name }: SaveOrganization.Input): Promise<SaveOrganization.Output> {
    const orgsRepo = this.getRepository(PgOrganization)
    const orgs = await orgsRepo.save({ name })
    return { id: String(orgs.id) }
  }
}
