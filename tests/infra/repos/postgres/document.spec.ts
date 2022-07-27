import { makeFakeDb, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import {
  PgAddress,
  PgAdmissionProposal,
  PgBasePermission,
  PgContact,
  PgDocument,
  PgImage,
  PgModule,
  PgOrganization,
  PgOrganizationMember,
  PgUser,
  PgUserPermission,
} from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { mockDocument } from '@/tests/infra/repos/postgres/mocks/document'
import { PgDocumentRepository } from '@/infra/repos/postgres'
import { Document } from '@/domain/value-objects'

describe('PgDocumentRepository', () => {
  let sut: PgDocumentRepository
  let connection: PgConnection
  let pgUserRepo: Repository<PgUser>
  let pgDocumentRepo: Repository<PgDocument>
  let backup: IBackup

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
      PgBasePermission,
      PgUserPermission,
      PgModule,
      PgOrganizationMember,
    ])
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
    pgDocumentRepo = connection.getRepository(PgDocument)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgDocumentRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('loadAll', () => {
    it('should load documents', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const pgDocument = await pgDocumentRepo.save({
        user: pgUser,
        number: mockDocument().number.replace(/\D/, ''),
        type: mockDocument().type,
      })

      const documents = await sut.load({ number: pgDocument.number })

      pgDocument.number = pgDocument.number.replace(/\D/, '')

      expect(documents).toEqual(new Document(pgDocument.number))
    })
  })
})
