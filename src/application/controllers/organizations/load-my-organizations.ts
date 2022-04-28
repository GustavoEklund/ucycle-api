import { LoadMyOrganizations } from '@/domain/use-cases'
import { HttpResponse, ok } from '@/application/helpers'

type HttpRequest = {
  userId: string
}

export class LoadMyOrganizationsController {
  public constructor(private readonly loadMyOrganizations: LoadMyOrganizations) {}

  public async handle({ userId }: HttpRequest): Promise<HttpResponse<LoadMyOrganizations.Output>> {
    const organizations = await this.loadMyOrganizations.perform({ userId })
    return ok(organizations)
  }
}
