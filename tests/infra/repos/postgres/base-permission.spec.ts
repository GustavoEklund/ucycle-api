import { PgBasePermissionRepository } from '@/infra/repos/postgres'
import { BasePermission } from '@/domain/entities/permission'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

import { faker } from '@faker-js/faker'
import { IBackup } from 'pg-mem'
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

describe('PgBasePermissionRepository', () => {
  let sut: PgBasePermissionRepository
  let connection: PgConnection
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([
      PgBasePermission,
      PgUser,
      PgModule,
      PgDocument,
      PgContact,
      PgOrganization,
      PgAddress,
      PgImage,
      PgAdmissionProposal,
      PgUserPermission,
    ])
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgBasePermissionRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should load base permission', async () => {
    const moduleId = faker.datatype.uuid()
    const expectedBasePermission = new BasePermission({
      id: faker.datatype.uuid(),
      code: 'ANY_BASE_PERMISSION',
      read: true,
      write: true,
      owner: false,
      name: 'any base permission',
      description: 'any base permission description',
      moduleId,
      expiration: new Date('2021-03-01T10:00:00'),
    })
    const pgModule = await connection.getRepository(PgModule).save({
      id: moduleId,
    })
    await connection.getRepository(PgBasePermission).save({
      id: expectedBasePermission.id,
      code: expectedBasePermission.code.value,
      read: expectedBasePermission.read,
      write: expectedBasePermission.write,
      owner: expectedBasePermission.owner,
      name: expectedBasePermission.name,
      status: 'GRANTED',
      description: expectedBasePermission.description,
      module: pgModule,
      expiresAt: expectedBasePermission.expiration,
    })

    const basePermission = await sut.load({ code: 'ANY_BASE_PERMISSION' })

    expect(basePermission).toEqual(expectedBasePermission)
  })

  it('should return undefined if base permission not found', async () => {
    const basePermission = await sut.load({ code: 'ANY_BASE_PERMISSION' })

    expect(basePermission).toBeUndefined()
  })
})
