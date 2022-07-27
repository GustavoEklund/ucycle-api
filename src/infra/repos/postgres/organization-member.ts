import { LoadOrganizationMember } from '@/domain/contracts/repos'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { OrganizationMember } from '@/domain/entities'
import { PgOrganizationMember } from '@/infra/repos/postgres/entities/organization-member'

export class PgOrganizationMemberRepository extends PgRepository implements LoadOrganizationMember {
  public async load({
    user,
    organization,
  }: LoadOrganizationMember.Input): Promise<LoadOrganizationMember.Output> {
    const pgOrganizationMemberRepo = this.getRepository(PgOrganizationMember)
    const pgOrganizationMember = await pgOrganizationMemberRepo
      .createQueryBuilder('organizationMember')
      .leftJoinAndSelect('organizationMember.user', 'user')
      .leftJoinAndSelect('organizationMember.organization', 'organization')
      .leftJoinAndSelect('organizationMember.admissionProposal', 'admissionProposal')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('organization.id = :organizationId', {
        organizationId: organization.id,
      })
      .getOne()

    if (pgOrganizationMember === undefined) return undefined
    return new OrganizationMember({
      userId: pgOrganizationMember.user.id,
      admissionProposalId: pgOrganizationMember.admissionProposal.id,
      joinDate: pgOrganizationMember.joinDate,
    })
  }
}
