import {
  LoadAdmissionProposals,
  LoadOrganization,
  LoadUserAccount,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import {
  AlreadyAppliedToJoinOrganizationError,
  OrganizationNotFoundError,
  TheOrganizationOwnerCanNotApplyToJoinOrganizationError,
  UserAccountNotFoundError,
} from '@/domain/entities/errors'
import { Observer, Publisher } from '@/domain/events'
import { ApplicationToJoinOrganizationSent } from '@/domain/events/organization'
import { Email, makeContacts } from '@/domain/value-objects/contact'
import { Document } from '@/domain/value-objects/document'
import { Mailer } from '@/domain/contracts/gateways'

export interface ApplyToJoinOrganization {
  perform: (input: ApplyToJoinOrganization.Input) => Promise<ApplyToJoinOrganization.Output>
}

export class ApplyToJoinOrganizationUseCase extends Publisher implements ApplyToJoinOrganization {
  public constructor(
    private readonly userAccountRepo: LoadUserAccount,
    private readonly organizationRepo: LoadOrganization,
    private readonly admissionProposalRepo: SaveAdmissionProposal & LoadAdmissionProposals
  ) {
    super()
  }

  public async perform({
    userId,
    organizationId,
  }: ApplyToJoinOrganization.Input): Promise<ApplyToJoinOrganization.Output> {
    const userAccount = await this.userAccountRepo.load({ id: userId })
    if (userAccount === undefined) throw new UserAccountNotFoundError(userId)
    const organization = await this.organizationRepo.load({ id: organizationId })
    if (organization === undefined) throw new OrganizationNotFoundError(organizationId)
    if (organization.ownerUser.id === userAccount.id)
      throw new TheOrganizationOwnerCanNotApplyToJoinOrganizationError()
    const admissionProposals = await this.admissionProposalRepo.load({ userId, organizationId })
    if (admissionProposals.length > 0)
      throw new AlreadyAppliedToJoinOrganizationError(organizationId)
    const { id: admissionProposalId } = await this.admissionProposalRepo.save({
      userId,
      organizationId,
    })
    const event = new ApplicationToJoinOrganizationSent({
      admissionProposalId,
      user: {
        id: userAccount.id,
        name: userAccount.name ?? '',
        documents: userAccount.documents.map((document) => new Document(document.number)),
        contacts: makeContacts(userAccount.contacts),
      },
      organization: {
        id: organization.id,
        name: organization.name,
        ownerUser: {
          id: organization.ownerUser.id,
          contacts: makeContacts(organization.ownerUser.contacts),
        },
      },
    })
    this.notify(event)
  }
}

export namespace ApplyToJoinOrganization {
  export type Input = {
    userId: string
    organizationId: string
  }
  export type Output = void
}

export class ApplicationToJoinOrganizationSentCommunicatorUseCase extends Observer {
  public constructor(private readonly mailer: Mailer) {
    super({ domainEvents: ['APPLICATION_TO_JOIN_ORGANIZATION_SENT'] })
  }

  public async handle({
    admissionProposalId,
    user,
    organization,
  }: ApplicationToJoinOrganizationSent): Promise<void> {
    await this.mailer.sendWithTemplate({
      recipient: {
        email: Email.getPrimary(organization.ownerUser.contacts)?.value.address ?? '',
      },
      template: {
        id: 'd-e2679264028841579b0eb21a65e0a9d0',
        data: {
          userId: user.id,
          userName: user.name,
          userEmail: Email.getPrimary(user.contacts)?.value.address ?? '',
          organizationName: organization.name,
          admissionProposalId,
        },
      },
    })
  }
}
