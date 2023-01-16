import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { LoadMyShoppingCart } from '@/domain/use-cases/shopping-cart'
import { ShoppingCartNotFoundError } from '@/domain/entities/errors/shopping-cart'

type HttpRequest = {
  userId?: string
  shoppingCartId?: string
}

type Model = LoadMyShoppingCart.Output | Error[]

export class LoadMyShoppingCartController extends Controller {
  public constructor(private readonly loadMyShoppingCart: LoadMyShoppingCart) {
    super()
  }

  public async perform({ userId, shoppingCartId }: HttpRequest): Promise<HttpResponse<Model>> {
    const output = await this.loadMyShoppingCart.perform({
      user: { id: userId },
      shoppingCart: { id: shoppingCartId },
    })
    if (output instanceof ShoppingCartNotFoundError) return HttpResponse.notFound([output])
    return HttpResponse.ok(output)
  }
}
