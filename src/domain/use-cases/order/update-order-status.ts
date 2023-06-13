import { Publisher } from '@/domain/events'
import { LoadOrder, LoadUserAccount, SaveOrder } from '@/domain/contracts/repos'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'
import { OrderNotFoundError } from '@/domain/entities/errors/order'
import { OrderStatus } from '@/domain/entities/order'

export interface UpdateOrderStatus {
  perform: (input: UpdateOrderStatus.Input) => Promise<UpdateOrderStatus.Output>
}

export class UpdateOrderStatusUseCase extends Publisher implements UpdateOrderStatus {
  public constructor(
    private readonly userAccountRepository: LoadUserAccount,
    private readonly orderRepository: LoadOrder & SaveOrder
  ) {
    super()
  }

  public async perform(input: UpdateOrderStatus.Input): Promise<UpdateOrderStatus.Output> {
    const user = await this.userAccountRepository.load({ id: input.user.id })
    if (user === undefined) return new UserAccountNotFoundError(input.user.id)
    const order = await this.orderRepository.load({ code: input.order.code })
    if (order === undefined) return new OrderNotFoundError(input.order.code)
    order.status = input.order.status as OrderStatus
    await this.orderRepository.save(order)
  }
}

export namespace UpdateOrderStatus {
  export type Input = {
    user: {
      id: string
    }
    order: {
      code: string
      status: string
    }
  }

  export type Output = undefined | UserAccountNotFoundError | OrderNotFoundError
}
