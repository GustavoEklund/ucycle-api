import {
  LoadAdmissionProposal,
  LoadUserAccount,
  LoadUserPermission,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import { PermissionStatus } from '@/domain/entities/permission'
import { UnauthorizedUserError } from '@/domain/entities/errors/permission'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { AdmissionProposalNotFoundError } from '@/domain/entities/errors/organization'

export interface DeclineAdmissionProposal {
  perform: (input: DeclineAdmissionProposal.Input) => Promise<DeclineAdmissionProposal.Output>
}

export class DeclineAdmissionProposalUseCase {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly admissionProposalRepo: LoadAdmissionProposal & SaveAdmissionProposal,
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
    const userPermission = await this.userPermissionRepo.load({
      code: 'DECLINE_ADMISSION_PROPOSAL',
      status: PermissionStatus.GRANTED,
      grantToUserId: admissionProposal.userId,
      organizationId: admissionProposal.organizationId,
    })
    if (userPermission === undefined)
      return new UnauthorizedUserError(user.id, 'DECLINE_ADMISSION_PROPOSAL')
    admissionProposal.decline()
    await this.admissionProposalRepo.save(admissionProposal)
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
