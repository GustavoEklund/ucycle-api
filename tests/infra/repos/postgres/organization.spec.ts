import { makeFakeDb, mockOrganization } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { PgOrganization, PgUser, PgDocument, PgContact } from '@/infra/repos/postgres/entities'
import { PgOrganizationRepository } from '@/infra/repos/postgres/organization'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'

describe('PgOrganizationRepository', () => {
  let sut: PgOrganizationRepository
  let connection: PgConnection
  let pgOrganizationRepo: Repository<PgOrganization>
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgOrganization, PgUser, PgDocument, PgContact])
    backup = db.backup()
    pgOrganizationRepo = connection.getRepository(PgOrganization)
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgOrganizationRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('save', () => {
    it('should save organization', async () => {
      let pgUser = pgUserRepo.create({
        firstName: 'any_name',
        lastName: 'any_last_name',
        firstAccess: true,
        documents: Promise.resolve([]),
        contacts: Promise.resolve([
          { verified: false, type: 'EMAIL', value: { type: 'PRIMARY', address: 'new_email' } },
        ]),
        organizations: Promise.resolve([]),
      })
      pgUser = await pgUserRepo.save(pgUser)
      const organization = mockOrganization()

      const { id: organizationId } = await sut.save({
        name: organization.name,
        address: { ...organization.address },
        ownerUserId: pgUser.id,
      })

      const pgOrganization = await pgOrganizationRepo.findOne({
        where: { id: organizationId },
        relations: ['ownerUser'],
      })
      expect(pgOrganization).toMatchObject({
        id: organizationId,
        name: organization.name,
        ...organization.address,
        ownerUser: pgUser,
      })
    })
  })
})
