import { PgPersonRepository } from '@/infra/repos/postgres'

export const makePgPersonsRepo = (): PgPersonRepository => {
  return new PgPersonRepository()
}
