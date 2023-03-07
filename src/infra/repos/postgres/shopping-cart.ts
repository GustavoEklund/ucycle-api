import { LoadShoppingCart, SaveShoppingCart } from '@/domain/contracts/repos'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { ShoppingCart } from '@/domain/entities/shopping-cart'
import {
  PgProduct,
  PgShoppingCart,
  PgShoppingCartProduct,
  PgUser,
} from '@/infra/repos/postgres/entities'
import { Product } from '@/domain/entities/product'

export class PgShoppingCartRepository
  extends PgRepository
  implements SaveShoppingCart, LoadShoppingCart
{
  public async save(shoppingCart: ShoppingCart): Promise<void> {
    let pgUser: PgUser | undefined
    if (shoppingCart.userId) pgUser = await this.getRepository(PgUser).findOne(shoppingCart.userId)
    const pgShoppingCartRepository = this.getRepository(PgShoppingCart)
    let pgShoppingCart = await pgShoppingCartRepository.findOne(shoppingCart.id)
    if (pgShoppingCart === undefined) {
      pgShoppingCart = await pgShoppingCartRepository.save({
        id: shoppingCart.id,
        createdBy: pgUser,
        shoppingCartProducts: Promise.resolve([]),
      })
    }
    const pgShoppingCartProducts = await this.getRepository(PgShoppingCartProduct).find({
      where: {
        shoppingCart: { id: pgShoppingCart.id },
      },
      relations: ['product'],
    })
    for (const pgShoppingCartProduct of pgShoppingCartProducts) {
      if (!shoppingCart.containsProduct(pgShoppingCartProduct.product.id))
        await this.getRepository(PgShoppingCartProduct).softRemove(pgShoppingCartProduct)
    }
    for (const shoppingCartProduct of shoppingCart.products) {
      const pgProduct = await this.getRepository(PgProduct).findOneOrFail(shoppingCartProduct.id)
      const existingShoppingCartProduct = pgShoppingCartProducts.find(
        (pgShoppingCartProduct) => pgShoppingCartProduct.product.id === shoppingCartProduct.id
      )
      await this.getRepository(PgShoppingCartProduct).save({
        id: existingShoppingCartProduct?.id,
        title: shoppingCartProduct.title,
        amount: shoppingCartProduct.amount,
        priceInCents: shoppingCartProduct.priceInCents,
        shoppingCart: pgShoppingCart,
        product: pgProduct,
      })
    }
  }

  public async load({ id, userId }: LoadShoppingCart.Input): Promise<LoadShoppingCart.Output> {
    const pgShoppingCarts = await this.getRepository(PgShoppingCart).find({
      where: [{ id }, { createdBy: { id: userId } }],
      relations: ['shoppingCartProducts', 'shoppingCartProducts.product', 'createdBy'],
    })
    const pgShoppingCart = pgShoppingCarts[0]
    if (pgShoppingCart === undefined) return undefined
    const shoppingCart = new ShoppingCart({
      id: pgShoppingCart.id,
      userId: pgShoppingCart.createdBy?.id,
    })
    const pgShoppingCartProducts = await pgShoppingCart.shoppingCartProducts
    pgShoppingCartProducts.forEach((pgShoppingCartProduct) => {
      const pgProduct = pgShoppingCartProduct.product
      const product = new Product({
        id: pgProduct.id,
        title: pgProduct.title,
        description: pgProduct.description ?? '',
        pictureUrl: pgProduct.pictureUrl,
        price: {
          totalInCents: pgProduct.totalPriceInCents,
          discountInPercentage: pgProduct.totalDiscountInPercentage,
        },
      })
      shoppingCart.addProduct(product, pgShoppingCartProduct.amount)
    })
    return shoppingCart
  }
}
