import { Controller } from '@/application/controllers'
import { LoadProductCategoriesFromSearchQuery } from '@/domain/query'
import { HttpResponse } from '@/application/helpers'

type HttpRequest = {
  pageNumber: number
  pageSize: number
}

type Model = {
  id: string
  name: string
}[]

export class LoadProductCategoriesController extends Controller {
  constructor(private readonly productCategories: LoadProductCategoriesFromSearchQuery) {
    super()
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const productCategories = await this.productCategories.loadFromSearch({
      page: {
        number: httpRequest.pageNumber,
        size: httpRequest.pageSize,
      },
    })
    return HttpResponse.ok(productCategories)
  }
}
