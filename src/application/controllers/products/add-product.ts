import { Controller } from '@/application/controllers'
import { AddProduct } from '@/domain/use-cases/products'
import { HttpResponse } from '@/application/helpers'
import {
  ProductCondition,
  ProductWarrantyDurationUnit,
  ProductWarrantyType,
} from '@/domain/entities/product'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { CategoryNotFoundException } from '@/domain/entities/errors/category'

export type HttpRequest = {
  userId: string
  title: string
  description: string
  priceInCents: number
  condition: ProductCondition
  categoryId: string
  warrantyType: ProductWarrantyType
  warrantyDurationTime: number
  warrantyDurationUnit: ProductWarrantyDurationUnit
  files: {
    buffer: Buffer
    mimeType: string
  }[]
}

export class AddProductController extends Controller {
  public constructor(private readonly addProduct: AddProduct) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.addProduct.perform({
      seller: { id: httpRequest.userId },
      category: { id: httpRequest.categoryId },
      title: httpRequest.title,
      description: httpRequest.description,
      pictures: httpRequest.files,
      priceInCents: httpRequest.priceInCents,
      condition: httpRequest.condition,
      warranty: {
        type: httpRequest.warrantyType,
        duration: {
          time: httpRequest.warrantyDurationTime,
          unit: httpRequest.warrantyDurationUnit,
        },
      },
    })
    if (output instanceof UserNotFoundError) return HttpResponse.unauthorized()
    if (output instanceof CategoryNotFoundException) return HttpResponse.notFound([output])
    return HttpResponse.noContent()
  }
}
