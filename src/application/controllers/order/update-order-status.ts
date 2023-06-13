import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { UpdateOrderStatus } from '@/domain/use-cases/order'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'
import { OrderNotFoundError } from '@/domain/entities/errors/order'

type HttpRequest = {
  userId: string
  orderCode: string
  status: string
}

export class UpdateOrderStatusController extends Controller {
  public constructor(private readonly updateOrderStatus: UpdateOrderStatus) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const output = await this.updateOrderStatus.perform({
      user: {
        id: httpRequest.userId,
      },
      order: {
        code: httpRequest.orderCode,
        status: httpRequest.status,
      },
    })
    if (output instanceof UserAccountNotFoundError)
      return HttpResponse.unprocessableEntity([output])
    if (output instanceof OrderNotFoundError) return HttpResponse.unprocessableEntity([output])
    return HttpResponse.noContent()
  }

  public override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.orderCode, fieldName: 'orderCode' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.status, fieldName: 'status' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
