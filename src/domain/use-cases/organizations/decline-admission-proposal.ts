import {
  LoadAdmissionProposal,
  LoadUserAccount,
  LoadUserPermission,
} from '@/domain/contracts/repos'
import {
  AdmissionProposalNotFoundError,
  UnauthorizedUserError,
  UserNotFoundError,
} from '@/domain/entities/errors'
import { PermissionStatus } from '@/domain/entities/permission'

export interface DeclineAdmissionProposal {
  perform: (input: DeclineAdmissionProposal.Input) => Promise<DeclineAdmissionProposal.Output>
}

export class DeclineAdmissionProposalUseCase {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly admissionProposalRepo: LoadAdmissionProposal,
    private readonly userPermissionRepo: LoadUserPermission
  ) {}

  public async perform(
    input: DeclineAdmissionProposal.Input
  ): Promise<DeclineAdmissionProposal.Output> {
    const user = await this.userRepo.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    const admissionProposal = await this.admissionProposalRepo.load({
      id: input.admissionProposal.id,
    })
    if (admissionProposal === undefined)
      return new AdmissionProposalNotFoundError(input.admissionProposal.id)
    await this.userPermissionRepo.load({
      code: 'DECLINE_ADMISSION_PROPOSAL',
      status: PermissionStatus.GRANTED,
      grantToUserId: admissionProposal.userId,
      organizationId: admissionProposal.organizationId,
    })
    return new UnauthorizedUserError(user.id, 'DECLINE_ADMISSION_PROPOSAL')
  }
}

export namespace DeclineAdmissionProposal {
  export type Input = {
    user: {
      id: string
    }
    admissionProposal: {
      id: string
    }
  }
  export type Output =
    | undefined
    | UserNotFoundError
    | AdmissionProposalNotFoundError
    | UnauthorizedUserError
}
