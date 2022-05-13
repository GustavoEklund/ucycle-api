import { PgRepository } from '@/infra/repos/postgres/repository'
import { SaveAdmissionProposal } from '@/domain/contracts/repos'
import { PgAdmissionProposal, PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

export class PgAdmissionProposalRepository extends PgRepository implements SaveAdmissionProposal {
  public async save({
    userId,
    organizationId,
    status,
  }: SaveAdmissionProposal.Input): Promise<SaveAdmissionProposal.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOneOrFail(userId)
    const pgOrganizationRepo = this.getRepository(PgOrganization)
    const pgOrganization = await pgOrganizationRepo.findOneOrFail(organizationId)
    const pgAdmissionProposalRepo = this.getRepository(PgAdmissionProposal)
    const { id } = await pgAdmissionProposalRepo.save({
      status,
      organization: pgOrganization,
      createdBy: pgUser,
    })
    return { id }
  }
}
