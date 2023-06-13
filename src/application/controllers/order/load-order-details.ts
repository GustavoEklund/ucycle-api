import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { PgOrder } from '@/infra/repos/postgres/entities'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  code: string
  userId: string
}

export class LoadOrderDetailsController extends Controller {
  public constructor(private readonly pgConnection: PgConnection = PgConnection.getInstance()) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<any | Error[]>> {
    const pgOrder = await this.pgConnection.getRepository(PgOrder).findOneOrFail({
      where: {
        code: httpRequest.code,
      },
      relations: ['createdBy'],
    })
    return HttpResponse.ok({
      code: pgOrder.code,
      status: pgOrder.status,
      total: pgOrder.totalInCents,
      freight: pgOrder.shippingPriceInCents,
      estimatedDelivery: pgOrder.estimatedDeliveryDate,
      createdAt: pgOrder.createdAt,
    })
  }

  public override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.code, fieldName: 'code' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
