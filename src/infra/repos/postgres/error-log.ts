import { PgRepository } from '@/infra/repos/postgres/repository'
import { SaveErrorLogRepository } from '@/domain/contracts/repos'
import { ErrorLog } from '@/domain/entities/errors'
import { PgErrorLog, PgUser } from '@/infra/repos/postgres/entities'

export class PgLogErrorRepository extends PgRepository implements SaveErrorLogRepository {
  public async save(errorLog: ErrorLog): Promise<void> {
    const pgUserRepo = await this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ id: errorLog.userId })
    if (pgUser === undefined) throw new Error('user not found')
    const pgErrorLogRepository = this.getRepository(PgErrorLog)
    await pgErrorLogRepository.save({
      id: errorLog.id,
      code: errorLog.code,
      message: errorLog.message,
      stack: errorLog.stack,
      createdBy: pgUser,
    })
  }
}
