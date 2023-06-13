import { PgCategoryRepository } from '@/infra/repos/postgres'

export const makePgCategoryRepo = (): PgCategoryRepository => {
  return new PgCategoryRepository()
}
