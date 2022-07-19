import { PgRepository } from '@/infra/repos/postgres/repository'
import {
  LoadAdmissionProposal,
  LoadAdmissionProposals,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import { PgAdmissionProposal, PgOrganization, PgUser } from '@/infra/repos/postgres/entities'
import { AdmissionProposal } from '@/domain/entities'

export class PgAdmissionProposalRepository
  extends PgRepository
  implements SaveAdmissionProposal, LoadAdmissionProposal, LoadAdmissionProposals
{
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

  public async load(input: LoadAdmissionProposal.Input): Promise<LoadAdmissionProposal.Output> {
    const pgAdmissionProposalRepo = this.getRepository(PgAdmissionProposal)
    const pgAdmissionProposal = await pgAdmissionProposalRepo.findOne(input.id, {
      relations: ['organization', 'createdBy'],
    })
    if (pgAdmissionProposal === undefined) return undefined
    return new AdmissionProposal({
      id: pgAdmissionProposal.id,
      userId: pgAdmissionProposal.createdBy.id,
      organizationId: pgAdmissionProposal.organization.id,
    })
  }

  public async loadAll({
    userId,
    organizationId,
  }: LoadAdmissionProposals.Input): Promise<LoadAdmissionProposals.Output> {
    const pgAdmissionProposalRepo = this.getRepository(PgAdmissionProposal)
    const pgAdmissionProposalsQueryBuilder =
      pgAdmissionProposalRepo.createQueryBuilder('admission_proposal')
    if (userId !== undefined)
      pgAdmissionProposalsQueryBuilder
        .leftJoinAndSelect('admission_proposal.createdBy', 'user')
        .andWhere('user.id = :userId', { userId })
    if (organizationId !== undefined)
      pgAdmissionProposalsQueryBuilder
        .leftJoinAndSelect('admission_proposal.organization', 'organization')
        .andWhere('organization.id = :organizationId', { organizationId })
    const pgAdmissionProposals = await pgAdmissionProposalsQueryBuilder.getMany()
    return pgAdmissionProposals.map((admissionProposal) => ({
      id: admissionProposal.id,
      user: {
        id: admissionProposal.createdBy.id,
        name: `${admissionProposal.createdBy.firstName} ${admissionProposal.createdBy.lastName}`,
      },
      organization: {
        id: admissionProposal.organization.id,
        name: admissionProposal.organization.name,
      },
    }))
  }
}
