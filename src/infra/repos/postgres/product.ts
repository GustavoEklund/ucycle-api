import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadProduct } from '@/domain/contracts/repos'
import { PgProduct } from '@/infra/repos/postgres/entities'
import { Product } from '@/domain/entities/product'

export class PgProductRepository extends PgRepository implements LoadProduct {
  public async load({ id }: LoadProduct.Input): Promise<LoadProduct.Output> {
    const pgProductRepository = this.getRepository(PgProduct)
    const pgProduct = await pgProductRepository.findOne(id)
    if (pgProduct === undefined) return undefined
    return new Product({
      id: pgProduct.id,
      title: pgProduct.title,
      description: pgProduct.description ?? '',
      pictureUrl: pgProduct.pictureUrl,
      price: {
        totalInCents: pgProduct.totalPriceInCents,
        discountInPercentage: pgProduct.totalDiscountInPercentage,
      },
    })
  }
}
