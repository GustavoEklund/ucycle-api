import { makeFakeDb, mockOrganization, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
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
import { PgAdmissionProposalRepository } from '@/infra/repos/postgres/admission-proposal'
import { mockAddress } from '@/tests/infra/repos/postgres/mocks/address'

describe('PgAdmissionProposalRepository', () => {
  let sut: PgAdmissionProposalRepository
  let connection: PgConnection
  let pgAddressRepo: Repository<PgAddress>
  let pgOrganizationRepo: Repository<PgOrganization>
  let pgAdmissionProposalRepo: Repository<PgAdmissionProposal>
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
    ])
    backup = db.backup()
    pgAddressRepo = connection.getRepository(PgAddress)
    pgOrganizationRepo = connection.getRepository(PgOrganization)
    pgUserRepo = connection.getRepository(PgUser)
    pgAdmissionProposalRepo = connection.getRepository(PgAdmissionProposal)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgAdmissionProposalRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('save', () => {
    it('should save admission proposal', async () => {
      const [pgUser, pgUserOwner] = await pgUserRepo.save([mockPgUser(), mockPgUser()])
      const pgAddress = await pgAddressRepo.save(mockAddress())
      const organization = mockOrganization({
        address: pgAddress,
        ownerUser: pgUserOwner,
        pictures: [],
      })
      const pgOrganization = await pgOrganizationRepo.save(organization)

      const { id: admissionProposalId } = await sut.save({
        status: 'any_status',
        userId: pgUser.id,
        organizationId: pgOrganization.id,
      })

      const admissionProposal = await pgAdmissionProposalRepo.findOne({
        where: { id: admissionProposalId },
        relations: ['createdBy', 'organization', 'organization.address', 'organization.ownerUser'],
      })
      expect(admissionProposal).toMatchObject({
        id: admissionProposalId,
        status: 'any_status',
        organization: pgOrganization,
        createdBy: pgUser,
      })
    })
  })
})
