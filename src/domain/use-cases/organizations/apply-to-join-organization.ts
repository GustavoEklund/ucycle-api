import {
  LoadAdmissionProposals,
  LoadOrganization,
  LoadOrganizationMember,
  LoadUserAccount,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import {
  AlreadyAppliedToJoinOrganizationError,
  AlreadyMemberOfOrganizationError,
  OrganizationNotFoundError,
  TheOrganizationOwnerCanNotApplyToJoinOrganizationError,
  UserAccountNotFoundError,
} from '@/domain/entities/errors'
import { Publisher } from '@/domain/events'
import { ApplicationToJoinOrganizationSent } from '@/domain/events/organization'
import { AdmissionProposalStatus } from '@/domain/entities/organization'

export interface ApplyToJoinOrganization {
  perform: (input: ApplyToJoinOrganization.Input) => Promise<ApplyToJoinOrganization.Output>
}

export class ApplyToJoinOrganizationUseCase extends Publisher implements ApplyToJoinOrganization {
  public constructor(
    private readonly userAccountRepo: LoadUserAccount,
    private readonly organizationRepo: LoadOrganization,
    private readonly admissionProposalRepo: SaveAdmissionProposal & LoadAdmissionProposals,
    private readonly organizationMemberRepo: LoadOrganizationMember
  ) {
    super()
  }

  public async perform({
    userId,
    organizationId,
  }: ApplyToJoinOrganization.Input): Promise<ApplyToJoinOrganization.Output> {
    const user = await this.userAccountRepo.load({ id: userId })
    if (user === undefined) throw new UserAccountNotFoundError(userId)
    const organization = await this.organizationRepo.load({ id: organizationId })
    if (organization === undefined) throw new OrganizationNotFoundError(organizationId)
    if (organization.ownerUserId === user.id)
      throw new TheOrganizationOwnerCanNotApplyToJoinOrganizationError()
    const admissionProposals = await this.admissionProposalRepo.loadAll({ userId, organizationId })
    if (admissionProposals.length > 0)
      throw new AlreadyAppliedToJoinOrganizationError(organizationId)
    const organizationMember = await this.organizationMemberRepo.load({
      user: { id: userId },
      organization: { id: organizationId },
    })
    if (organizationMember !== undefined) throw new AlreadyMemberOfOrganizationError(organizationId)
    const { id: admissionProposalId } = await this.admissionProposalRepo.save({
      userId,
      organizationId,
      status: AdmissionProposalStatus.pending,
    })
    const event = new ApplicationToJoinOrganizationSent({
      admissionProposalId,
      user: {
        id: user.id,
        name: user.account.name.value,
        documents: user.account.documents,
        contacts: user.account.contacts,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        ownerUser: {
          id: organization.ownerUserId,
          contacts: [],
        },
      },
    })
    await this.notify(event)
  }
}

export namespace ApplyToJoinOrganization {
  export type Input = {
    userId: string
    organizationId: string
  }
  export type Output = void
}
