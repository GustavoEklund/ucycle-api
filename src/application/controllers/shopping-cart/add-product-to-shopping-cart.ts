import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { AddProductToShoppingCart } from '@/domain/use-cases/shopping-cart'
import {
  ShoppingCartDoesNotBelongToUserError,
  ShoppingCartNotFoundError,
} from '@/domain/entities/errors/shopping-cart'
import { ProductNotFoundError } from '@/domain/entities/errors/product'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'

type HttpRequest = {
  userId: string
  productId: string
  shoppingCartId: string
}

export class AddProductToShoppingCartController extends Controller {
  public constructor(private readonly addProductToShoppingCart: AddProductToShoppingCart) {
    super()
  }

  public async perform({ productId, shoppingCartId, userId }: HttpRequest): Promise<HttpResponse> {
    const output = await this.addProductToShoppingCart.perform({
      product: { id: productId },
      shoppingCart: { id: shoppingCartId },
      user: { id: userId },
    })
    if (output instanceof ShoppingCartNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof ProductNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof UserAccountNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof ShoppingCartDoesNotBelongToUserError)
      return HttpResponse.forbidden([output])
    return HttpResponse.noContent()
  }
}
