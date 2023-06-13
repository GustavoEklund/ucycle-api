import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadProduct, SaveProduct } from '@/domain/contracts/repos'
import { PgImage, PgProduct, PgProductCategory, PgUser } from '@/infra/repos/postgres/entities'
import { Product } from '@/domain/entities/product'

export class PgProductRepository extends PgRepository implements SaveProduct, LoadProduct {
  public async save(product: Product): Promise<void> {
    const pgProductCategory = await this.getRepository(PgProductCategory).findOneOrFail(
      product.categoryId
    )
    const pgUser = await this.getRepository(PgUser).findOneOrFail(product.sellerId)
    const pgProduct = await this.getRepository(PgProduct).save({
      id: product.id,
      title: product.title,
      description: product.description,
      condition: product.condition,
      category: pgProductCategory,
      createdBy: pgUser,
      warrantyType: product.warranty.type,
      warrantyDurationTime: product.warranty.duration.time,
      warrantyDurationUnit: product.warranty.duration.unit,
      totalPriceInCents: product.price.totalInCents,
      totalDiscountInPercentage: product.price.discountInPercentage,
    })
    for (const pictureUrl of product.pictureUrls) {
      await this.getRepository(PgImage).save({
        url: pictureUrl,
        product: pgProduct,
        createdBy: pgUser,
      })
    }
  }

  public async load({ id }: LoadProduct.Input): Promise<LoadProduct.Output> {
    const pgProduct = await this.getRepository(PgProduct).findOne(id, {
      relations: ['category', 'pictures', 'createdBy'],
    })
    if (pgProduct === undefined) return undefined
    const pgProductCategory = await pgProduct.category
    const pgPictures = await pgProduct.pictures
    const pgUser = await pgProduct.createdBy
    return new Product({
      id: pgProduct.id,
      title: pgProduct.title,
      description: pgProduct.description,
      categoryId: pgProductCategory.id,
      sellerId: pgUser.id,
      condition: pgProduct.condition,
      pictureUrls: pgPictures.map((pgPicture) => pgPicture.url),
      warranty: {
        type: pgProduct.warrantyType,
        duration: {
          time: pgProduct.warrantyDurationTime,
          unit: pgProduct.warrantyDurationUnit,
        },
      },
      price: {
        totalInCents: pgProduct.totalPriceInCents,
        discountInPercentage: pgProduct.totalDiscountInPercentage,
      },
    })
  }
}
