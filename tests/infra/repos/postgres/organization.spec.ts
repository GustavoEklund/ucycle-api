import { v4 } from 'uuid'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'

import { PgOrganization, PgUser, PgDocument, PgContact } from '@/infra/repos/postgres/entities'
import { PgOrganizationRepository } from '@/infra/repos/postgres/organization'
import { mockOrganization } from './mocks/organization'

describe('Organization', () => {
  let sut: PgOrganizationRepository
  let connection: PgConnection
  let PgOrganizationRepo: Repository<PgOrganization>
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgOrganization, PgUser, PgDocument, PgContact])
    backup = db.backup()
    PgOrganizationRepo = connection.getRepository(PgOrganization)
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

  // describe('save', () => {
  //   it('should save organization', async () => {
  //     const organization = mockOrganization()
  //     const pgUser = pgUserRepo.create({
  //       firstName: 'any_name',
  //       lastName: 'any_last_name',
  //       firstAccess: true,
  //       documents: Promise.resolve([]),
  //       contacts: Promise.resolve([
  //         { verified: false, type: 'EMAIL', value: { type: 'PRIMARY', address: 'new_email' } },
  //       ]),
  //     })

  //     const { id: existingId } = await pgUserRepo.save(pgUser)
  //     pgUser.id = existingId

  //     const { id: organizationId } = await sut.save({
  //       name: organization.name,
  //       address: { ...organization.address },
  //       ownerUserId: existingId,
  //     })

  //     const pgOrganization = await PgOrganizationRepo.findOne(organizationId)

  //     expect(pgOrganization).toMatchObject({
  //       id: organizationId,
  //       name: organization.name,
  //       ...organization.address,
  //       ownerUser: pgUser,
  //     })
  //   })
  // })
})
