import { PgConnection } from '@/infra/repos/postgres/helpers'
import {
  PgAddress,
  PgAdmissionProposal,
  PgContact,
  PgDocument,
  PgImage,
  PgOrganization,
  PgUser,
} from '@/infra/repos/postgres/entities'
import {
  makeFakeDb,
  mockContact,
  mockDocument,
  mockOrganization,
  mockPgUser,
} from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgOrganizationMemberRepository } from '@/infra/repos/postgres'

import { Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('PgOrganizationMemberRepository', () => {
  let sut: PgOrganizationMemberRepository
  let connection: PgConnection
  let backup: IBackup
  let pgOrganizationRepo: Repository<PgOrganization>
  let pgUserRepo: Repository<PgUser>
  let pgDocumentRepo: Repository<PgDocument>
  let pgContactRepo: Repository<PgContact>

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([
      PgOrganization,
      PgUser,
      PgDocument,
      PgContact,
      PgAddress,
      PgImage,
      PgAdmissionProposal,
    ])
    backup = db.backup()
    pgOrganizationRepo = connection.getRepository(PgOrganization)
    pgUserRepo = connection.getRepository(PgUser)
    pgDocumentRepo = connection.getRepository(PgDocument)
    pgContactRepo = connection.getRepository(PgContact)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgOrganizationMemberRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('load', () => {
    it('should load organization member', async () => {
      let pgOrganization = pgOrganizationRepo.create(mockOrganization({}))
      pgOrganization = await pgOrganizationRepo.save(pgOrganization)
      const pgUser1 = await pgUserRepo.create(mockPgUser())
      pgUser1.documents = Promise.resolve([pgDocumentRepo.create(mockDocument())])
      pgUser1.contacts = Promise.resolve([pgContactRepo.create(mockContact())])
      await pgUserRepo.save(pgUser1)
      const pgUser2 = await pgUserRepo.create(mockPgUser())
      pgUser2.documents = Promise.resolve([pgDocumentRepo.create(mockDocument())])
      pgUser2.contacts = Promise.resolve([pgContactRepo.create(mockContact())])
      await pgUserRepo.save(pgUser2)
      const pgUser3 = await pgUserRepo.create(mockPgUser())
      pgUser3.documents = Promise.resolve([pgDocumentRepo.create(mockDocument())])
      pgUser3.contacts = Promise.resolve([pgContactRepo.create(mockContact())])
      await pgUserRepo.save(pgUser3)
      pgOrganization.members = Promise.resolve([pgUser1, pgUser2, pgUser3])
      await pgOrganizationRepo.save(pgOrganization)

      const organizationMember = await sut.load({
        user: { id: pgUser2.id },
        organization: { id: pgOrganization.id },
      })

      expect(organizationMember).toEqual({
        id: pgUser2.id,
        firstName: pgUser2.firstName,
        lastName: pgUser2.lastName,
        contacts: (await pgUser2.contacts).map((pgContact) => ({
          value: pgContact.value,
          type: pgContact.type,
          label: pgContact.label,
          verified: pgContact.verified,
        })),
        documents: (await pgUser2.documents).map((pgDocument) => ({
          number: pgDocument.number,
        })),
      })
    })
  })
})
