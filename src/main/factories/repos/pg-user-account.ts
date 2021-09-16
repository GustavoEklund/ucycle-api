import { PgUserAccountRepository } from '@/infra/db/postgres/repos'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
