import { LoadProductCategoriesFromSearchQuery } from '@/domain/query'
import { PgRepository } from '@/infra/repos/postgres/repository'

export class ProductCategoryQuery
  extends PgRepository
  implements LoadProductCategoriesFromSearchQuery
{
  public async loadFromSearch(
    input: LoadProductCategoriesFromSearchQuery.Input
  ): Promise<LoadProductCategoriesFromSearchQuery.Output> {
    const queryResult = await this.getEntityManager().query(
      `
        SELECT product_category.*
        FROM product_category
        LIMIT $1
        OFFSET $2
      `,
      [input.page.size, input.page.number - 1]
    )
    if (!Array.isArray(queryResult)) return []
    return queryResult.map((productCategory) => ({
      id: productCategory.id,
      name: productCategory.name,
    }))
  }
}
