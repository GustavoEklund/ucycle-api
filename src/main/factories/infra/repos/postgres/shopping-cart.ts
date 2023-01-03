import { PgShoppingCartRepository } from '@/infra/repos/postgres'

export const makePgShoppingCartRepository = (): PgShoppingCartRepository => {
  return new PgShoppingCartRepository()
}
