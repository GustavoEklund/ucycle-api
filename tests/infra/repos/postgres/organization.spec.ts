import { makeFakeDb, mockPgOrganization, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
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
import { PgOrganizationRepository } from '@/infra/repos/postgres/organization'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { mockAddress } from '@/tests/infra/repos/postgres/mocks/address'

describe('PgOrganizationRepository', () => {
  let sut: PgOrganizationRepository
  let connection: PgConnection
  let pgOrganizationRepo: Repository<PgOrganization>
  let pgAddressRepo: Repository<PgAddress>
  let pgUserRepo: Repository<PgUser>
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
      PgModule,
      PgUserPermission,
    ])
    backup = db.backup()
    pgOrganizationRepo = connection.getRepository(PgOrganization)
    pgAddressRepo = connection.getRepository(PgAddress)
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
      const organization = mockPgOrganization({})
      const address = mockAddress()

      const { id: organizationId } = await sut.save({
        name: organization.name,
        address: address,
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

  describe('loadAll', () => {
    it('should load all organizations', async () => {
      const pgAddress = await pgAddressRepo.save(mockAddress())
      await pgAddressRepo.save(pgAddress)
      const pgOrganization = pgOrganizationRepo.create(mockPgOrganization({}))
      pgOrganization.address = pgAddress
      await pgOrganizationRepo.save(pgOrganization)
      const pgUser = pgUserRepo.create(mockPgUser())
      pgUser.organizationsOwned = Promise.resolve([pgOrganization])
      await pgUserRepo.save(pgUser)

      const organizations = await sut.loadAll({ userId: pgUser.id })

      expect(organizations).toEqual([
        {
          id: pgOrganization.id,
          name: pgOrganization.name,
          pictures: [],
          address: {
            buildingNumber: '76',
            city: 'any_city',
            country: 'any_country',
            neighbourhood: 'any_neighbourhood',
            postalCode: 'any_postal_code',
            state: 'any_state',
            street: 'any_street',
          },
        },
      ])
    })
  })
})
