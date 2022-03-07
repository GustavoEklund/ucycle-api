import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'

import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'
import { PgOrganizationRepository } from '@/infra/repos/postgres/organization'

describe('Organization', () => {
  let sut: PgOrganizationRepository
  let connection: PgConnection
  let PgOrganizationRepo: Repository<PgOrganization>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgOrganization, PgUser])
    backup = db.backup()
    PgOrganizationRepo = connection.getRepository(PgOrganization)
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
})
