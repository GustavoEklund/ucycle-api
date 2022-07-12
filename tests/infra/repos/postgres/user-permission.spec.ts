import { UserPermission } from '@/domain/entities/permission'
import { PgUserPermissionRepository } from '@/infra/repos/postgres/user-permission'
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

import {
  makeFakeDb,
  mockPgModule,
  mockPgOrganization,
  mockPgUser,
  mockPgUserPermission,
} from '@/tests/infra/repos/postgres/mocks'
import { faker } from '@faker-js/faker'
import { IBackup } from 'pg-mem'

describe('PgUserPermissionRepository', () => {
  let sut: PgUserPermissionRepository
  let connection: PgConnection
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([
      PgUserPermission,
      PgBasePermission,
      PgUser,
      PgModule,
      PgDocument,
      PgContact,
      PgOrganization,
      PgAddress,
      PgImage,
      PgAdmissionProposal,
    ])
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserPermissionRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgUserPermissionRepository)
  })

  describe('save', () => {
    it('should save user permission', async () => {
      const targetPgUser = await connection.getRepository(PgUser).save(mockPgUser())
      const ownerPgUser = await connection.getRepository(PgUser).save(mockPgUser())
      const pgOrganization = await connection
        .getRepository(PgOrganization)
        .save(mockPgOrganization({}))
      const pgModule = await connection.getRepository(PgModule).save({
        id: faker.datatype.uuid(),
      })
      const userPermission = new UserPermission({
        id: faker.datatype.uuid(),
        code: 'ANY_BASE_PERMISSION',
        read: true,
        write: true,
        owner: false,
        name: 'any base permission',
        description: 'any base permission description',
        moduleId: pgModule.id,
        expiration: new Date('2021-03-01T10:00:00'),
        grantToUserId: targetPgUser.id,
        grantByUserId: ownerPgUser.id,
        grantAtOrganizationId: pgOrganization.id,
      })

      await sut.save(userPermission)

      const pgUser = await connection.getRepository(PgUserPermission).findOne(userPermission.id, {
        relations: ['createdBy', 'grantToUser', 'grantAtOrganization', 'module'],
      })
      expect(userPermission.id).toEqual(pgUser?.id)
      expect(userPermission.code.value).toEqual(pgUser?.code)
      expect(userPermission.read).toEqual(pgUser?.read)
      expect(userPermission.write).toEqual(pgUser?.write)
      expect(userPermission.owner).toEqual(pgUser?.owner)
      expect(userPermission.name).toEqual(pgUser?.name)
      expect(userPermission.description).toEqual(pgUser?.description)
      expect(userPermission.moduleId).toEqual(pgUser?.module?.id)
      expect(userPermission.grantToUserId).toEqual(pgUser?.grantToUser?.id)
      expect(userPermission.grantByUserId).toEqual(pgUser?.createdBy?.id)
      expect(userPermission.grantAtOrganizationId).toEqual(pgUser?.grantAtOrganization?.id)
      expect(userPermission.expiration).toEqual(pgUser?.expiresAt)
    })
  })

  describe('load', () => {
    it('should load user permission', async () => {
      const targetPgUser = await connection.getRepository(PgUser).save(mockPgUser())
      const ownerPgUser = await connection.getRepository(PgUser).save(mockPgUser())
      const pgModule = await connection.getRepository(PgModule).save(mockPgModule())
      const pgOrganization = await connection.getRepository(PgOrganization).save(
        mockPgOrganization({
          ownerUser: ownerPgUser,
        })
      )
      const pgUserPermission = await connection.getRepository(PgUserPermission).save(
        mockPgUserPermission({
          grantToUser: targetPgUser,
          createdBy: ownerPgUser,
          module: pgModule,
          grantToOrganization: pgOrganization,
        })
      )

      const userPermission = await sut.load({ id: pgUserPermission.id })

      expect(userPermission?.id).toEqual(pgUserPermission.id)
      expect(userPermission?.code.value).toEqual(pgUserPermission.code)
      expect(userPermission?.grantToUserId).toEqual(targetPgUser.id)
      expect(userPermission?.grantByUserId).toEqual(ownerPgUser.id)
      expect(userPermission?.grantAtOrganizationId).toEqual(pgOrganization.id)
      expect(userPermission?.moduleId).toEqual(pgModule.id)
    })
  })
})
