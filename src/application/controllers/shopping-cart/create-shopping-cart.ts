import { Controller } from '@/application/controllers'
import { CreateShoppingCart } from '@/domain/use-cases/shopping-cart'
import { HttpResponse } from '@/application/helpers'

type HttpRequest = {
  userId?: string
}

type Model = {
  id: string
}

export class CreateShoppingCartController extends Controller {
  public constructor(private readonly createShoppingCart: CreateShoppingCart) {
    super()
  }

  public async perform({ userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const output = await this.createShoppingCart.perform({ user: { id: userId } })
    return HttpResponse.ok(output)
  }
}
