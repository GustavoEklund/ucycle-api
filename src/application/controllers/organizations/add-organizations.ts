import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { AuthenticationError } from '@/domain/entities/errors'
import { AddOrganizations } from '@/domain/use-cases'

type HttpRequest = { name: string; address: object; ownerUserId: number }
type Model = Error | void

export class addOrganizationsController extends Controller {
  constructor(private readonly addOrganizations: AddOrganizations) {
    super()
  }

  async perform({ name, address, ownerUserId }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const response = await this.addOrganizations({
        name,
        address,
        ownerUserId,
      })
      return ok(response)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }
}
