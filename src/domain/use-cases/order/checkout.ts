import { Publisher } from '@/domain/events'
import { LoadCoupon, LoadProduct, LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { OrderMustHaveAtLeastOneItemError } from '@/domain/entities/errors/order'
import { ProductNotFoundError } from '@/domain/entities/errors/product'
import { ShippingCalculatorGateway, UUIDGenerator } from '@/domain/contracts/gateways'
import { Order, OrderStatus } from '@/domain/entities/order'
import { SaveOrder } from '@/domain/contracts/repos/order'
import { OrderPlacedEvent } from '@/domain/events/order'

export interface Checkout {
  perform: (input: Checkout.Input) => Promise<Checkout.Output>
}

export class CheckoutUseCase extends Publisher implements Checkout {
  public constructor(
    private readonly cryptoGateway: UUIDGenerator,
    private readonly userRepository: LoadUserAccount,
    private readonly productRepository: LoadProduct,
    private readonly couponRepository: LoadCoupon,
    private readonly orderRepository: SaveOrder,
    private readonly shippingGateway: ShippingCalculatorGateway
  ) {
    super()
  }

  public async perform(input: Checkout.Input): Promise<Checkout.Output> {
    const user = await this.userRepository.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    if (input.items.length === 0) return new OrderMustHaveAtLeastOneItemError()
    const orderId = this.cryptoGateway.uuid()
    const order = new Order({
      id: orderId,
      shippingAddressId: input.shipping.address.id,
      userId: user.id,
      freight: 27.7 * 100,
      status: OrderStatus.DRAFT,
    })
    for (const item of input.items) {
      const product = await this.productRepository.load({ id: item.id })
      if (product === undefined) return new ProductNotFoundError(item.id)
      order.addItem(product, item.amount)
    }
    for (const couponCode of input.coupons) {
      const coupon = await this.couponRepository.load({ code: couponCode })
      if (coupon === undefined) continue
      order.addCoupon(coupon, new Date())
    }
    await this.orderRepository.save(order)
    const event = new OrderPlacedEvent({ order })
    await this.notify(event)
    return {
      order: {
        id: order.id,
        totalInCents: order.getTotalInCents(),
      },
    }
  }
}

export namespace Checkout {
  export type Input = {
    user: {
      id: string
    }
    shipping: {
      address: {
        id: string
      }
    }
    items: {
      id: string
      amount: number
    }[]
    coupons: string[]
  }
  export type Output =
    | {
        order: {
          id: string
          totalInCents: number
        }
      }
    | UserNotFoundError
    | OrderMustHaveAtLeastOneItemError
}
