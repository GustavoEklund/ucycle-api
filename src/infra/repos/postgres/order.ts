import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadOrder, SaveOrder } from '@/domain/contracts/repos'
import { Order, OrderStatus } from '@/domain/entities/order'
import { PgAddress, PgOrder, PgOrderItem, PgProduct, PgUser } from '@/infra/repos/postgres/entities'
import { Product } from '@/domain/entities/product'

export class PgOrderRepository extends PgRepository implements SaveOrder, LoadOrder {
  public async load(input: LoadOrder.Input): Promise<Order> {
    const pgOrder = await this.getRepository(PgOrder).findOneOrFail({
      where: { code: input.code },
      relations: [
        'createdBy',
        'shippingAddress',
        'items',
        'items.product',
        'items.product.category',
        'items.product.pictures',
        'items.product.createdBy',
      ],
    })
    const order = new Order({
      id: pgOrder.id,
      status: pgOrder.status as OrderStatus,
      userId: pgOrder.createdBy?.id || '',
      freight: pgOrder.shippingPriceInCents,
      shippingAddressId: pgOrder.shippingAddress?.id || '',
    })
    const pgOrderItems = await pgOrder.items
    for (const pgOrderItem of pgOrderItems) {
      const pgPictures = await pgOrderItem.product.pictures
      const product = new Product({
        id: pgOrderItem.product.id,
        title: pgOrderItem.productTitle,
        price: {
          totalInCents: pgOrderItem.priceInCents,
          discountInPercentage: 0,
        },
        description: pgOrderItem.product.description,
        pictureUrls: pgPictures.map((picture) => picture.url),
        warranty: {
          duration: {
            time: pgOrderItem.product.warrantyDurationTime,
            unit: pgOrderItem.product.warrantyDurationUnit,
          },
          type: pgOrderItem.product.warrantyType,
        },
        sellerId: pgOrderItem.product.createdBy.id,
        categoryId: pgOrderItem.product.category.id,
        condition: pgOrderItem.product.condition,
      })
      order.addItem(product, pgOrderItem.amount)
    }
    return order
  }

  public async save(order: Order): Promise<void> {
    const shippingAddress = await this.getRepository(PgAddress).findOneOrFail(
      order.shippingAddressId
    )
    const pgUser = await this.getRepository(PgUser).findOneOrFail(order.userId)
    const pgOrder = this.getRepository(PgOrder).create({
      id: order.id,
      code: order.id,
      coupons: Promise.resolve([]),
      shippingAddress,
      createdBy: pgUser,
      status: order.status,
      totalInCents: order.getTotalInCents(),
      shippingPriceInCents: order.freight,
      estimatedDeliveryDate: new Date(),
    })
    await this.getRepository(PgOrder).save(pgOrder)
    for (const item of order.items) {
      const pgProduct = await this.getRepository(PgProduct).findOneOrFail(item.productId, {
        relations: ['pictures'],
      })
      const pgImage = (await pgProduct.pictures)[0]
      const pgOrderItem = this.getRepository(PgOrderItem).create({
        productTitle: pgProduct.title,
        priceInCents: item.priceInCents,
        amount: item.amount,
        product: pgProduct,
        order: pgOrder,
        totalInCents: item.getTotal(),
        createdBy: pgUser,
        pictureUrl: pgImage.url,
      })
      await this.getRepository(PgOrderItem).save(pgOrderItem)
    }
  }
}
