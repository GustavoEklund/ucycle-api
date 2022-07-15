import { PgContactRepository } from '@/infra/repos/postgres'

export const makePgContactRepo = (): PgContactRepository => {
  return new PgContactRepository()
}
