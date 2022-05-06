import { ApplyToJoinOrganization } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'

type HttpRequest = {
  userId: string
  organizationId: string
}

export class ApplyToJoinOrganizationController extends Controller {
  public constructor(private readonly applyToJoinOrganization: ApplyToJoinOrganization) {
    super()
  }

  public override async perform({
    userId,
    organizationId,
  }: HttpRequest): Promise<HttpResponse<string>> {
    await this.applyToJoinOrganization.perform({ userId, organizationId })
    return ok('')
  }
}
