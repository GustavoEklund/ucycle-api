import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { LoadMyOrdersQuery } from '@/domain/query'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  userId: string
  pageNumber: string
  pageSize: string
}

export class LoadMyOrdersController extends Controller {
  public constructor(private readonly orders: LoadMyOrdersQuery) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<LoadMyOrdersQuery.Output>> {
    const output = await this.orders.loadMyOrders({
      user: {
        id: httpRequest.userId,
      },
      page: {
        number: parseInt(httpRequest.pageNumber),
        size: parseInt(httpRequest.pageSize),
      },
    })
    return HttpResponse.ok(output)
  }

  public override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.pageNumber, fieldName: 'pageNumber' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.pageSize, fieldName: 'pageSize' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
