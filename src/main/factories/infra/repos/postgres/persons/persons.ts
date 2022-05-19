import { PgPersonsRepository } from '@/infra/repos/postgres'

  export const makePgPersonsRepo = (): PgPersonsRepository => {
    return new PgPersonsRepository()
  }
  