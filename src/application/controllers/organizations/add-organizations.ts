import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { AuthenticationError } from '@/domain/entities/errors'
import { AddOrganizations } from '@/domain/use-cases'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}
type HttpRequest = { name: string; address: Address; userId: number }
type Model = Error | { id: string }

export class AddOrganizationsController extends Controller {
  constructor(private readonly addOrganizations: AddOrganizations) {
    super()
  }

  async perform({ name, address, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const response = await this.addOrganizations({
        name,
        address,
        userId,
      })
      return ok(response)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }
}
