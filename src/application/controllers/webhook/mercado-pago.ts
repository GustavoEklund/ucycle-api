import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { UpdateOrderStatus } from '@/domain/use-cases/order'

export type HttpRequest = {
  action: 'payment.created' | 'payment.updated'
  api_version: string
  data: {
    id: string
  }
  date_created: string
  id: number
  live_mode: boolean
  type: 'payment'
  user_id: string
}

export class MercadoPagoWebhookController extends Controller {
  public constructor(private readonly updateOrderStatus: UpdateOrderStatus) {
    super()
  }

  public async perform(): Promise<HttpResponse<undefined | Error[]>> {
    await this.updateOrderStatus.perform({
      user: {
        id: '',
      },
      order: {
        code: '',
        status: '',
      },
    })
    return HttpResponse.ok(undefined)
  }
}
