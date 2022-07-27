import { makeFakeDb, mockPerson } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { PgPerson } from '@/infra/repos/postgres/entities'
import { PgPersonRepository } from '@/infra/repos/postgres'

import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'

describe('PgPersonsRepository', () => {
  let sut: PgPersonRepository
  let connection: PgConnection
  let pgPersonsRepo: Repository<PgPerson>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgPerson])
    backup = db.backup()
    pgPersonsRepo = connection.getRepository(PgPerson)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgPersonRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('save', () => {
    it('should save person', async () => {
      const person = [mockPerson()]

      const sutReturn = await sut.save(person)

      const pgPersons = await pgPersonsRepo.findOne({
        where: [{ id: sutReturn[0].id }],
      })
      expect(pgPersons).toMatchObject({
        id: sutReturn[0].id,
      })
    })
  })

  describe('load', () => {
    it('should load person', async () => {
      const pgPersons = pgPersonsRepo.create(mockPerson())
      await pgPersonsRepo.save(pgPersons)

      const persons = await sut.load({ id: pgPersons.id })

      expect(persons).toEqual({
        id: pgPersons.id,
      })
    })
  })
})
