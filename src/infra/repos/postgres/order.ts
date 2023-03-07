import { PgRepository } from '@/infra/repos/postgres/repository'
import { SaveOrder } from '@/domain/contracts/repos'
import { Order } from '@/domain/entities/order'
import { PgOrder, PgProduct } from '@/infra/repos/postgres/entities'

export class PgOrderRepository extends PgRepository implements SaveOrder {
  public async save(order: Order): Promise<void> {
    const pgProducts: PgProduct[] = []
    for (const item of order.items) {
      const pgProduct = await this.getRepository(PgProduct).findOneOrFail(item.productId)
      pgProducts.push(pgProduct)
    }
    await this.getRepository(PgOrder).save({
      id: order.id,
      code: order.id,
      coupons: Promise.resolve([]),
      freight: order.freight,
      items: Promise.resolve(pgProducts),
    })
  }
}
