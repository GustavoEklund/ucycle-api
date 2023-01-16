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
    if (pgShoppingCart === undefined)
      pgShoppingCart = pgShoppingCartRepository.create({
        id: shoppingCart.id,
        createdBy: pgUser,
      })
    const pgShoppingCartProducts = await pgShoppingCart.shoppingCartProducts
    pgShoppingCartProducts.forEach((pgShoppingCartProduct) => {
      const shoppingCartProduct = shoppingCart.products.find(
        (shoppingCartProduct) => shoppingCartProduct.id === pgShoppingCartProduct.id
      )
      const shoppingCartProducWasDeleted = shoppingCartProduct === undefined
      if (!shoppingCartProducWasDeleted) return
      this.getRepository(PgShoppingCartProduct).softRemove(pgShoppingCartProduct)
    })
    await pgShoppingCartRepository.save(pgShoppingCart)
    for (const shoppingCartProduct of shoppingCart.products) {
      const pgProduct = await this.getRepository(PgProduct).findOneOrFail(shoppingCartProduct.id)
      await this.getRepository(PgShoppingCartProduct).save({
        id: shoppingCartProduct.id,
        title: shoppingCartProduct.title,
        amount: shoppingCartProduct.amount,
        priceInCents: shoppingCartProduct.totalPrinceInCents,
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
      shoppingCart.addProduct(product)
    })
    return shoppingCart
  }
}
