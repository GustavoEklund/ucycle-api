import { Observer } from '@/domain/events'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { LoadUserAccount } from '@/domain/contracts/repos'

export class JoinUserToOrganizationUseCase extends Observer {
  public constructor(private readonly userRepository: LoadUserAccount) {
    super({ domainEvents: ['ADMISSION_PROPOSAL_ACCEPTED'] })
  }

  public async handle(input: AdmissionProposalAccepted): Promise<void> {
    await this.userRepository.load({ id: input.admissionProposal.userId })
  }
}
