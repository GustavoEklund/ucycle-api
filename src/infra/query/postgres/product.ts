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
            SELECT
              product.*,
              image.url as picture_url
            FROM product
            LEFT JOIN LATERAL (
              SELECT url
              FROM image
              WHERE image.product_id = product.id
              ORDER BY image.created_at
              LIMIT 1) as image ON true
            LIMIT $1
            OFFSET $2;
        `
        : `
            SELECT
            product.*,
            image.url as picture_url
            FROM product
            LEFT JOIN LATERAL (
              SELECT url
              FROM image
              WHERE image.product_id = product.id
              ORDER BY image.created_at
              LIMIT 1) as image ON true
            WHERE to_tsvector(title) @@ to_tsquery('${searchTerms}')
            LIMIT $1
            OFFSET $2
        `
    const queryResult = await this.getEntityManager().query(query, [
      input.page.size,
      (input.page.number - 1) * input.page.size,
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
