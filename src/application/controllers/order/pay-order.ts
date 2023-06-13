import { Controller } from '@/application/controllers'
import { PayOrder } from '@/domain/use-cases/order'
import { HttpResponse } from '@/application/helpers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  userId: string
  orderCode: string
  payment: {
    method: {
      id: string
    }
    installments: number
    token: string
  }
}

export class PayOrderController extends Controller {
  public constructor(private readonly payOrder: PayOrder) {
    super()
  }

  public async perform({
    userId,
    orderCode,
    payment,
  }: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.payOrder.perform({
      order: {
        code: orderCode,
      },
      user: {
        id: userId,
      },
      payment: payment,
    })
    if (output instanceof Error) return HttpResponse.notFound([output])
    return HttpResponse.created(undefined)
  }

  public override buildValidators({ userId, orderCode, payment }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: orderCode, fieldName: 'orderCode' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: payment?.method?.id, fieldName: 'payment.method.id' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: payment?.installments, fieldName: 'payment.installments' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: payment?.token, fieldName: 'payment.token' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
