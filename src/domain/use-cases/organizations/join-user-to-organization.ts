import { Observer } from '@/domain/events'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors'

interface JoinUserToOrganization {
  perform: (input: JoinUserToOrganization.Input) => Promise<JoinUserToOrganization.Output>
}

export class JoinUserToOrganizationUseCase extends Observer implements JoinUserToOrganization {
  public constructor(private readonly userRepository: LoadUserAccount) {
    super({ domainEvents: ['ADMISSION_PROPOSAL_ACCEPTED'] })
  }

  public async handle(input: AdmissionProposalAccepted): Promise<JoinUserToOrganization.Output> {
    await this.userRepository.load({ id: input.admissionProposal.userId })
    return new UserNotFoundError(input.acceptedByUser.id)
  }

  public async perform(
    input: JoinUserToOrganization.Input
  ): Promise<JoinUserToOrganization.Output> {
    return this.handle(input)
  }
}

namespace JoinUserToOrganization {
  export type Input = AdmissionProposalAccepted
  export type Output = undefined | UserNotFoundError
}
