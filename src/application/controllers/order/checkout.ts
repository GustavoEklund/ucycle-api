import { Controller } from '@/application/controllers'
import { Checkout } from '@/domain/use-cases/order'
import { HttpResponse } from '@/application/helpers'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { OrderItemAmountMustBeGreaterThanZeroError } from '@/domain/entities/errors/order'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

export type HttpRequest = {
  userId: string
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

export type Model = {
  order: {
    id: string
    totalInCents: number
  }
}

export class CheckoutController extends Controller {
  public constructor(private readonly checkout: Checkout) {
    super()
  }

  public async perform({ userId, items, coupons, shipping }: HttpRequest): Promise<HttpResponse> {
    const output = await this.checkout.perform({
      user: { id: userId },
      shipping,
      items,
      coupons,
    })
    if (output instanceof UserNotFoundError) return HttpResponse.unprocessableEntity([output])
    if (output instanceof OrderItemAmountMustBeGreaterThanZeroError)
      return HttpResponse.unprocessableEntity([output])
    return HttpResponse.accepted(output)
  }

  public override buildValidators({ userId, shipping }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: shipping?.address?.id, fieldName: 'shipping.address.id' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
