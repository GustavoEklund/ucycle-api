import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
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
import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { PgUserAccountRepository } from '@/infra/repos/postgres/user-account'

import { mockUser } from '@/tests/domain/mocks/entities'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let connection: PgConnection

  let pgUserRepo: Repository<PgUser>

  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([
      PgUser,
      PgDocument,
      PgContact,
      PgOrganization,
      PgAddress,
      PgImage,
      PgAdmissionProposal,
    ])
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('save', () => {
    it('should save user account', async () => {
      const user = mockUser()

      await sut.save(user)

      const pgUser = await pgUserRepo.findOne({
        where: { id: user.id },
        relations: ['documents', 'contacts'],
      })
      expect({
        id: pgUser?.id,
        documents: await pgUser?.documents,
        contacts: (await pgUser?.contacts)?.map((pgContact) => ({
          label: pgContact.label,
          isPrivate: pgContact.isPrivate,
          type: pgContact.type,
          value: JSON.parse(pgContact.value),
          verified: pgContact.verified,
        })),
      }).toMatchObject({
        id: user.id,
        documents: user.account.documents,
        contacts: user.account.contacts,
      })
    })
  })
})
