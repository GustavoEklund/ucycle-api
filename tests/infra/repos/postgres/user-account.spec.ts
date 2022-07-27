import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
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
      PgBasePermission,
      PgUserPermission,
      PgModule,
      PgOrganizationMember,
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
      expect(pgUser?.id).toBe(user.id)
      expect(await pgUser?.contacts).toHaveLength(user.account.contacts.length)
      expect(await pgUser?.documents).toHaveLength(user.account.documents.length)
    })
  })
})
