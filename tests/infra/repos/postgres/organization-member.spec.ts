import { PgConnection } from '@/infra/repos/postgres/helpers'
import {
  PgAdmissionProposal,
  PgContact,
  PgDocument,
  PgOrganization,
  PgUser,
} from '@/infra/repos/postgres/entities'
import {
  makeFakeDb,
  mockDocument,
  mockPgAdmissionProposal,
  mockPgContact,
  mockPgOrganization,
  mockPgUser,
} from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgOrganizationMemberRepository } from '@/infra/repos/postgres'
import { PgOrganizationMember } from '@/infra/repos/postgres/entities/organization-member'
import { OrganizationMember } from '@/domain/entities'

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
  let pgOrganizationMemberRepo: Repository<PgOrganizationMember>

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb()
    backup = db.backup()
    pgOrganizationRepo = connection.getRepository(PgOrganization)
    pgUserRepo = connection.getRepository(PgUser)
    pgDocumentRepo = connection.getRepository(PgDocument)
    pgContactRepo = connection.getRepository(PgContact)
    pgOrganizationMemberRepo = connection.getRepository(PgOrganizationMember)
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
      const pgUser = await pgUserRepo.create(mockPgUser())
      pgUser.documents = Promise.resolve([pgDocumentRepo.create(mockDocument())])
      pgUser.contacts = Promise.resolve([pgContactRepo.create(mockPgContact())])
      await pgUserRepo.save(pgUser)
      let pgOrganization = await pgOrganizationRepo.create(mockPgOrganization({}))
      pgOrganization = await pgOrganizationRepo.save(pgOrganization)
      const pgAdmissionProposal = await connection.getRepository(PgAdmissionProposal).save(
        mockPgAdmissionProposal({
          createdBy: pgUser,
          organization: pgOrganization,
        })
      )
      let pgOrganizationMember = await pgOrganizationMemberRepo.create({
        user: pgUser,
        joinDate: new Date('2021-03-01'),
        admissionProposal: pgAdmissionProposal,
      })
      pgOrganizationMember = await pgOrganizationMemberRepo.save(pgOrganizationMember)
      pgOrganization.members = Promise.resolve([pgOrganizationMember])
      await pgOrganizationRepo.save(pgOrganization)

      const organizationMember = await sut.load({
        user: { id: pgUser.id },
        organization: { id: pgOrganization.id },
      })

      expect(organizationMember).toEqual(
        new OrganizationMember({
          userId: pgUser.id,
          admissionProposalId: pgAdmissionProposal.id,
          joinDate: new Date('2021-03-01'),
        })
      )
    })
  })
})
