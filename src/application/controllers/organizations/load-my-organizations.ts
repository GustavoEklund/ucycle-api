import { LoadMyOrganizations } from '@/domain/use-cases'
import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  userId: string
}

export class LoadMyOrganizationsController extends Controller {
  public constructor(private readonly loadMyOrganizations: LoadMyOrganizations) {
    super()
  }

  public async perform({ userId }: HttpRequest): Promise<HttpResponse<LoadMyOrganizations.Output>> {
    const organizations = await this.loadMyOrganizations.perform({ userId })
    return ok(organizations)
  }
}
