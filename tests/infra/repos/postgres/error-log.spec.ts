import { PgConnection } from '@/infra/repos/postgres/helpers'
import { IBackup } from 'pg-mem'
import { makeFakeDb, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgLogErrorRepository } from '@/infra/repos/postgres'
import { PgErrorLog, PgUser } from '@/infra/repos/postgres/entities'
import { ErrorLog } from '@/domain/entities/errors'
import { faker } from '@faker-js/faker'

describe('PgLogErrorRepository', () => {
  let sut: PgLogErrorRepository
  let connection: PgConnection
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb()
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgLogErrorRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  it('should save error log', async () => {
    const pgUser = await connection.getRepository(PgUser).save(mockPgUser())
    const errorLog = new ErrorLog({
      id: faker.datatype.uuid(),
      code: 'any_code',
      message: 'any_message',
      stack: 'any_stack',
      userId: pgUser.id,
    })

    await sut.save(errorLog)

    const pgErrorLog = await connection.getRepository(PgErrorLog).findOne({
      where: { id: errorLog.id },
      relations: ['createdBy'],
    })
    expect(pgErrorLog).toMatchObject({
      id: errorLog.id,
      code: errorLog.code,
      message: errorLog.message,
      stack: errorLog.stack,
      createdBy: pgUser,
    })
  })
})
