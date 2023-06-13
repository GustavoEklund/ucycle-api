import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadCategory } from '@/domain/contracts/repos'
import { PgProductCategory } from '@/infra/repos/postgres/entities'
import { Category } from '@/domain/entities/category'

export class PgCategoryRepository extends PgRepository implements LoadCategory {
  public async load(input: LoadCategory.Input): Promise<LoadCategory.Output> {
    const pgCategory = await this.getRepository(PgProductCategory).findOne({
      where: { id: input.id },
    })
    if (pgCategory === undefined) return undefined
    return new Category({
      id: pgCategory.id,
      name: pgCategory.name,
    })
  }
}
