import { UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { UnauthorizedUserError } from '@/domain/entities/errors/unauthorized-user'

export interface UpdateOrganization {
  perform(input: UpdateOrganization.Input): Promise<UpdateOrganization.Output>
}

export class UpdateOrganizationUseCase implements UpdateOrganization {
  public constructor(
    private readonly organizationRepo: LoadOrganization & SaveOrganization,
    private readonly userRepo: LoadUserAccount
  ) {}

  public async perform(input: UpdateOrganization.Input): Promise<UpdateOrganization.Output> {
    const user = await this.userRepo.load({ id: input.user.id })
    const organization = await this.organizationRepo.load({ id: input.organization.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    if (organization === undefined) return new OrganizationNotFoundError(input.organization.id)
    if (!organization.isOwner(user.id))
      return new UnauthorizedUserError(input.user.id, 'UPDATE_ORGANIZATION')
    organization.updateName(input.organization.name)
    organization.updateDescription(input.organization.description)
    this.organizationRepo.save(organization)
  }
}

export namespace UpdateOrganization {
  type User = {
    id: string
  }
  export type Organization = {
    id: string
    name: string
    description: string
  }
  export type Input = {
    organization: Organization
    user: User
  }
  export type Output =
    | undefined
    | OrganizationNotFoundError
    | UserNotFoundError
    | UnauthorizedUserError
}

type Setup = (organizationsRepo: SaveOrganization, crypto: UUIDGenerator) => UpdateOrganization
