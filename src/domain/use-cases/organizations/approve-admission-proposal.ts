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

export interface ApproveAdmissionProposal {
  perform: (input: ApproveAdmissionProposal.Input) => Promise<ApproveAdmissionProposal.Output>
}

export class ApproveAdmissionProposalUseCase implements ApproveAdmissionProposal {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly admissionProposalRepo: LoadAdmissionProposal,
    private readonly userPermissionRepo: LoadUserPermission
  ) {}

  public async perform(
    input: ApproveAdmissionProposal.Input
  ): Promise<ApproveAdmissionProposal.Output> {
    const user = await this.userRepo.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    const admissionProposal = await this.admissionProposalRepo.load({
      id: input.admissionProposal.id,
    })
    if (admissionProposal === undefined)
      return new AdmissionProposalNotFoundError(input.admissionProposal.id)
    await this.userPermissionRepo.load({
      grantToUserId: input.user.id,
      code: 'APPROVE_ADMISSION_PROPOSAL',
      status: PermissionStatus.GRANTED,
    })
    return new UnauthorizedUserError(input.user.id, 'APPROVE_ADMISSION_PROPOSAL')
  }
}

export namespace ApproveAdmissionProposal {
  export type Input = {
    user: {
      id: string
    }
    admissionProposal: {
      id: string
    }
  }
  export type Output = undefined | UserNotFoundError | AdmissionProposalNotFoundError
}
