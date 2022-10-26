import { LoadProductsFromSearchQuery } from '@/domain/query'
import { PgRepository } from '@/infra/repos/postgres/repository'

export class ProductQuery extends PgRepository implements LoadProductsFromSearchQuery {
  public async loadProductsFromSearch(
    input: LoadProductsFromSearchQuery.Input
  ): Promise<LoadProductsFromSearchQuery.Output> {
    const searchTerms = input.search?.terms?.trim().replace(/\|/, '').split(/\s/).join(' | ')
    const query =
      searchTerms === undefined
        ? `
            SELECT product.*
            FROM product
            LIMIT $1
            OFFSET $2
        `
        : `
            SELECT product.*
            FROM product
            WHERE to_tsvector(title) @@ to_tsquery('${searchTerms}')
            LIMIT $1
            OFFSET $2
        `
    const queryResult = await this.getEntityManager().query(query, [
      input.page.size,
      input.page.number - 1,
    ])
    if (!Array.isArray(queryResult)) return []
    return queryResult.map((product) => ({
      id: product.id,
      title: product.title,
      pictureUrl: product.picture_url,
      price: {
        discountInPercentage: product.total_discount_in_percentage,
        totalInCents: product.total_price_in_cents,
      },
    }))
  }
}
