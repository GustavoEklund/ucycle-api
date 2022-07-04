import { ApproveAdmissionProposal, ApproveAdmissionProposalUseCase } from '@/domain/use-cases'
import {
  LoadAdmissionProposal,
  LoadUserAccount,
  LoadUserPermission,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import { PermissionStatus } from '@/domain/entities/permission'
import { AdmissionProposalNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockAdmissionProposal, mockUser, mockUserPermission } from '@/tests/domain/mocks/entities'
import { UnauthorizedUserError } from '@/domain/entities/errors/unauthorized-user'
import { AdmissionProposal } from '@/domain/entities'

describe('ApproveAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let admissionProposalRepoSpy: MockProxy<LoadAdmissionProposal & SaveAdmissionProposal>
  let userPermissionRepoSpy: MockProxy<LoadUserPermission>
  let admissionProposalStub: AdmissionProposal
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
    admissionProposalStub = mockAdmissionProposal({ userId: 'any_user_id' })
    admissionProposalRepoSpy.load.mockResolvedValue(admissionProposalStub)
    userPermissionRepoSpy = mock()
    userPermissionRepoSpy.load.mockResolvedValue(mockUserPermission())
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

  it('should return UnauthorizedUserError if LoadUserPermission returns undefined', async () => {
    userPermissionRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UnauthorizedUserError('any_user_id', 'APPROVE_ADMISSION_PROPOSAL'))
  })

  it('should call SaveAdmissionProposal with correct input', async () => {
    const acceptSpy = jest.spyOn(admissionProposalStub, 'accept')

    await sut.perform(inputStub)

    expect(acceptSpy).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.save).toHaveBeenCalledWith(admissionProposalStub)
  })
})
