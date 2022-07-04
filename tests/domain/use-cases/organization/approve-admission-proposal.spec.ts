import { ApproveAdmissionProposal, ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import {
  LoadAdmissionProposal,
  LoadUserAccount,
  LoadUserPermission,
} from '@/domain/contracts/repos'
import { PermissionStatus } from '@/domain/entities/permission'
import { AdmissionProposalNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockAdmissionProposal, mockUser } from '@/tests/domain/mocks/entities'

describe('ApproveAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let admissionProposalRepoSpy: MockProxy<LoadAdmissionProposal>
  let userPermissionRepoSpy: MockProxy<LoadUserPermission>
  let sut: ApproveAdmissionProposal
  let inputStub: ApproveAdmissionProposal.Input

  beforeAll(() => {
    inputStub = {
      user: {
        id: 'any_user_id',
      },
      admissionProposal: {
        id: 'any_admission_proposal_id',
      },
    }
    userRepoSpy = mock()
    userRepoSpy.load.mockResolvedValue(mockUser())
    admissionProposalRepoSpy = mock()
    admissionProposalRepoSpy.load.mockResolvedValue(
      mockAdmissionProposal({ userId: 'any_user_id' })
    )
    userPermissionRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new ApproveAdmissionProposalUseCase(
      userRepoSpy,
      admissionProposalRepoSpy,
      userPermissionRepoSpy
    )
  })

  it('should call LoadUserRepository with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserRepository returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })

  it('should call LoadAdmissionProposal with correct input', async () => {
    await sut.perform(inputStub)

    expect(admissionProposalRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.load).toHaveBeenCalledWith({ id: 'any_admission_proposal_id' })
  })

  it('should return AdmissionProposalNotFoundError if LoadAdmissionProposal returns undefined', async () => {
    admissionProposalRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new AdmissionProposalNotFoundError('any_admission_proposal_id'))
  })

  it('should call LoadUserPermission with correct input', async () => {
    await sut.perform(inputStub)

    expect(userPermissionRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userPermissionRepoSpy.load).toHaveBeenCalledWith({
      grantToUserId: 'any_user_id',
      code: 'APPROVE_ADMISSION_PROPOSAL',
      status: PermissionStatus.GRANTED,
    })
  })
})
