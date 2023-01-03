import { SaveShoppingCart } from '@/domain/contracts/repos'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { ShoppingCart } from '@/domain/entities/shopping-cart'
import { PgShoppingCart, PgUser } from '@/infra/repos/postgres/entities'

export class PgShoppingCartRepository extends PgRepository implements SaveShoppingCart {
  public async save(shoppingCart: ShoppingCart): Promise<void> {
    let user: PgUser | undefined
    if (shoppingCart.userId) user = await this.getRepository(PgUser).findOne(shoppingCart.userId)
    await this.getRepository(PgShoppingCart).save({
      id: shoppingCart.id,
      createdBy: user,
    })
  }
}
