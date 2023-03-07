import { PgOrderRepository } from '@/infra/repos/postgres'

export const makePgOrderRepository = (): PgOrderRepository => {
  return new PgOrderRepository()
}
