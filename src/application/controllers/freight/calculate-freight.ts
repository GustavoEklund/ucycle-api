import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { ShippingCalculatorGateway } from '@/domain/contracts/gateways'

export type HttpRequest = {
  zipcode: string
}

type Model = {
  estimatedDeliveryDate: Date
  valueInCents: number
}

export class CalculateFreightController extends Controller {
  public constructor(private readonly shipping: ShippingCalculatorGateway) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model | Error[]>> {
    const output = await this.shipping.calculate({
      item: {
        dimensions: {
          height: 10,
          length: 15,
          width: 10,
        },
        weight: 1,
      },
      buildingNumber: '',
      zipcode: httpRequest.zipcode,
    })
    return HttpResponse.ok(output)
  }
}
