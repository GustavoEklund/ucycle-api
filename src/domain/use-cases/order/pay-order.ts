import { Publisher } from '@/domain/events'
import { LoadOrder, LoadUserAccount, SaveOrder } from '@/domain/contracts/repos'
import { CreatePayment } from '@/domain/contracts/gateways'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'
import { OrderNotFoundError } from '@/domain/entities/errors/order'
import { OrderPaidEvent } from '@/domain/events/order'

export interface PayOrder {
  perform: (input: PayOrder.Input) => Promise<PayOrder.Output>
}

export class PayOrderUseCase extends Publisher implements PayOrder {
  public constructor(
    private readonly userAccountRepository: LoadUserAccount,
    private readonly orderRepository: LoadOrder & SaveOrder,
    private readonly paymentGateway: CreatePayment
  ) {
    super()
  }

  public async perform(input: PayOrder.Input): Promise<PayOrder.Output> {
    const user = await this.userAccountRepository.load({ id: input.user.id })
    if (user === undefined) return new UserAccountNotFoundError(input.user.id)
    const order = await this.orderRepository.load({ code: input.order.code })
    if (order === undefined) return new OrderNotFoundError(input.order.code)
    const payment = await this.paymentGateway.createPayment({
      method: {
        id: input.payment.method.id,
      },
      order: {
        code: order.id,
      },
      totalInCents: order.getTotalInCents(),
      installments: input.payment.installments,
      token: input.payment.token,
      payer: {
        id: user.id,
        email: user.account.getPrimaryEmail().getFullPlainValue(),
      },
    })
    order.pay()
    await this.orderRepository.save(order)
    const event = new OrderPaidEvent({ order })
    await this.notify(event)
  }
}

export namespace PayOrder {
  export type Input = {
    user: {
      id: string
    }
    order: {
      code: string
    }
    payment: {
      method: {
        id: string
      }
      installments: number
      token: string
    }
  }
  export type Output = undefined | Error
}
