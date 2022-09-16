import { PgErrorLogRepository } from '@/infra/repos/postgres'

export const makePgErrorLogRepository = (): PgErrorLogRepository => {
  return new PgErrorLogRepository()
}
