import {
  LoadAdmissionProposal,
  LoadUserAccount,
  LoadUserPermission,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import { PermissionStatus } from '@/domain/entities/permission'
import { Publisher } from '@/domain/events'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { UnauthorizedUserError } from '@/domain/entities/errors/permission/unauthorized-user'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { AdmissionProposalNotFoundError } from '@/domain/entities/errors/organization'

export interface ApproveAdmissionProposal {
  perform: (input: ApproveAdmissionProposal.Input) => Promise<ApproveAdmissionProposal.Output>
}

export class ApproveAdmissionProposalUseCase extends Publisher implements ApproveAdmissionProposal {
  public constructor(
    private readonly userRepo: LoadUserAccount,
    private readonly admissionProposalRepo: LoadAdmissionProposal & SaveAdmissionProposal,
    private readonly userPermissionRepo: LoadUserPermission
  ) {
    super()
  }

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
    const userPermission = await this.userPermissionRepo.load({
      grantToUserId: input.user.id,
      code: 'APPROVE_ADMISSION_PROPOSAL',
      status: PermissionStatus.GRANTED,
    })
    if (userPermission === undefined)
      return new UnauthorizedUserError(input.user.id, 'APPROVE_ADMISSION_PROPOSAL')
    admissionProposal.approve()
    await this.admissionProposalRepo.save(admissionProposal)
    const event = new AdmissionProposalAccepted({
      acceptedByUser: user,
      admissionProposal: admissionProposal,
    })
    await this.notify(event)
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
