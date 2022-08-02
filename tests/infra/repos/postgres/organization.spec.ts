import { makeFakeDb, mockPgOrganization, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
import { mockAddress } from '@/tests/infra/repos/postgres/mocks/address'
import { Organization } from '@/domain/entities'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { PgAddress, PgOrganization, PgUser } from '@/infra/repos/postgres/entities'
import { PgOrganizationRepository } from '@/infra/repos/postgres/organization'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'

describe('PgOrganizationRepository', () => {
  let sut: PgOrganizationRepository
  let connection: PgConnection
  let pgOrganizationRepo: Repository<PgOrganization>
  let pgAddressRepo: Repository<PgAddress>
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb()
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
        contacts: Promise.resolve([
          { verified: false, type: 'EMAIL', value: { type: 'PRIMARY', address: 'new_email' } },
        ]),
      })
      pgUser = await pgUserRepo.save(pgUser)
      const organization = mockPgOrganization({})
      const address = mockAddress()

      const { id: organizationId } = await sut.save(
        new Organization({
          name: organization.name,
          id: pgUser.id,
          address: address,
          userId: pgUser.id,
          description: organization.description,
        })
      )

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
      const addressStub = mockAddress()
      const pgAddress = await pgAddressRepo.save(addressStub)
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
            buildingNumber: addressStub.buildingNumber,
            city: addressStub.city,
            country: addressStub.country,
            neighbourhood: addressStub.neighbourhood,
            postalCode: addressStub.zipCode,
            state: addressStub.state,
            street: addressStub.street,
          },
        },
      ])
    })
  })
})
