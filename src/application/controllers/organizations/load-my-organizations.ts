import { LoadMyOrganizations } from '@/domain/use-cases'

type HttpRequest = {
  userId: string
}

export class LoadMyOrganizationsController {
  public constructor(private readonly loadMyOrganizations: LoadMyOrganizations) {}

  public async handle({ userId }: HttpRequest): Promise<void> {
    await this.loadMyOrganizations.perform({ userId })
  }
}
