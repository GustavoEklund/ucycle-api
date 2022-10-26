import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { LoadProducts } from '@/domain/use-cases/products'

type HttpRequest = {
  userId?: string
  pageNumber: string
  pageSize: string
  searchTerms?: string
  relatedProductId?: string
}

export class LoadProductsController extends Controller {
  public constructor(private readonly loadProducts: LoadProducts) {
    super()
  }

  public async perform({
    userId,
    pageNumber,
    pageSize,
    searchTerms,
    relatedProductId,
  }: HttpRequest): Promise<HttpResponse> {
    const products = await this.loadProducts.perform({
      userId: userId,
      page: {
        number: Number(pageNumber),
        size: Number(pageSize),
      },
      search: {
        terms: searchTerms,
        relatedProductId: relatedProductId,
      },
    })
    return HttpResponse.ok(products)
  }

  public override buildValidators({ pageNumber, pageSize }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldName: 'pageNumber', value: pageNumber })
        .required(RequiredType.integer)
        .build(),
      ...ValidationBuilder.of({ fieldName: 'pageSize', value: pageSize })
        .required(RequiredType.integer)
        .build(),
    ]
  }
}
