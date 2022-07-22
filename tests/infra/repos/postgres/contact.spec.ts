import {
  makeEmailContact,
  makeFakeDb,
  makePhoneContact,
  mockPgUser,
} from '@/tests/infra/repos/postgres/mocks'
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
  PgUser,
  PgUserPermission,
} from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { PgContactRepository } from '@/infra/repos/postgres'
import { Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'

describe('PgContactRepository', () => {
  let sut: PgContactRepository
  let connection: PgConnection
  let pgUserRepo: Repository<PgUser>
  let pgContactRepo: Repository<PgContact>
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
    ])
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
    pgContactRepo = connection.getRepository(PgContact)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgContactRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('loadAll', () => {
    it('should load email contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const pgContact = await pgContactRepo.save({
        user: pgUser,
        label: makeEmailContact().label,
        value: makeEmailContact().value,
        type: makeEmailContact().type,
        isPrivate: makeEmailContact().isPrivate,
        verified: makeEmailContact().verified,
      })

      const contacts = await sut.load({ value: pgContact.value })

      expect(contacts).toEqual(new Email(pgContact.value, pgContact.label as EmailType))
    })

    it('should load phone contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const pgContact = await pgContactRepo.save({
        user: pgUser,
        label: makePhoneContact().label,
        value: makePhoneContact().value,
        type: makePhoneContact().type,
        isPrivate: makePhoneContact().isPrivate,
        verified: makePhoneContact().verified,
      })

      const contacts = await sut.load({ value: pgContact.value })

      expect(contacts).toEqual(new Phone(pgContact.value, pgContact.label as PhoneType))
    })
  })
})
