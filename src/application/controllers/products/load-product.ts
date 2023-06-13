import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { LoadProductDetails } from '@/domain/use-cases/products'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { ProductNotFoundError } from '@/domain/entities/errors/product'

type HttpRequest = {
  id: string
}

type Model = {
  id: string
  title: string
  description: string
  pictureUrls: string[]
  price: {
    totalInCents: number
    discountInPercentage: number
    discount: number
  }
}

export class LoadProductDetailsController extends Controller {
  public constructor(private readonly loadProductDetails: LoadProductDetails) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model | Error[]>> {
    const output = await this.loadProductDetails.perform(httpRequest)
    if (output instanceof ProductNotFoundError) return HttpResponse.notFound([output])
    return HttpResponse.ok(output)
  }

  public override buildValidators({ id }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: id, fieldName: 'id' }).required(RequiredType.string).build(),
    ]
  }
}
