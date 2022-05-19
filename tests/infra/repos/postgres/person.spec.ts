import { makeFakeDb, mockPerson, mockUser } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import {
  PgPersons,
} from '@/infra/repos/postgres/entities'
import { PgPersonsRepository } from '@/infra/repos/postgres'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { mockAddress } from '@/tests/infra/repos/postgres/mocks/address'

describe('PgPersonsRepository', () => {
  let sut: PgPersonsRepository
  let connection: PgConnection
  let PgPersonsRepo: Repository<PgPersons>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgPersons])
    backup = db.backup()
    PgPersonsRepo = connection.getRepository(PgPersons)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgPersonsRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('save', () => {
    it('should save person', async () => {
      const person = mockPerson()

      const { id: personId } = await sut.save({ ...person })

      const PgPersons = await PgPersonsRepo.findOne({
        where: { id: personId }
      })
      expect(PgPersons).toMatchObject({
        id: personId
      })
    })
  })
})
