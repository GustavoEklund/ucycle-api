import { LoadOrganizationMember } from '@/domain/contracts/repos'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgContact, PgDocument } from '@/infra/repos/postgres/entities'

export class PgOrganizationMemberRepository extends PgRepository implements LoadOrganizationMember {
  public async load({
    user,
    organization,
  }: LoadOrganizationMember.Input): Promise<LoadOrganizationMember.Output> {
    // const pgUser = this.getRepository(PgUser).findOne(user.id)
    const entityManager = this.getEntityManager()
    const pgUsers = await entityManager.query(
      `
      SELECT u.*
      FROM "organization_members" as "om"
      INNER JOIN "user" u on u."id" = om."userId"
      WHERE om."userId" = $1
      AND om."organizationId" = $2
    `,
      [user.id, organization.id]
    )
    if (pgUsers === undefined || pgUsers?.length <= 0) return undefined
    const pgUser = pgUsers[0]
    const pgContactRepo = this.getRepository(PgContact)
    const pgContacts = await pgContactRepo.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    })
    const pgDocumentRepo = this.getRepository(PgDocument)
    const pgDocuments = await pgDocumentRepo.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    })
    return {
      id: pgUser.id,
      firstName: pgUser.firstName,
      lastName: pgUser.lastName,
      contacts: pgContacts.map((pgContact) => ({
        value: pgContact.value,
        type: pgContact.type,
        label: pgContact.label,
        verified: pgContact.verified,
      })),
      documents: pgDocuments.map((pgDocument) => ({
        number: pgDocument.number,
      })),
    }
  }
}
