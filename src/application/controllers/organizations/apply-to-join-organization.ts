import { ApplyToJoinOrganization } from '@/domain/use-cases'

type HttpRequest = {
  userId: string
  organizationId: string
}

export class ApplyToJoinOrganizationController {
  public constructor(private readonly applyToJoinOrganization: ApplyToJoinOrganization) {}

  public async handle({ userId, organizationId }: HttpRequest): Promise<void> {
    await this.applyToJoinOrganization.perform({ userId, organizationId })
  }
}
