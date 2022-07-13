import { DeclineAdmissionProposal, DeclineAdmissionProposalUseCase } from '@/domain/use-cases'
import { mock, MockProxy } from 'jest-mock-extended'
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
import { mockAdmissionProposal, mockUser } from '@/tests/domain/mocks/entities'
import { User } from '@/domain/entities/user'
import { PermissionStatus } from '@/domain/entities/permission'
import { AdmissionProposal } from '@/domain/entities'

describe('DeclineAdmissionProposalUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let admissionProposalRepoSpy: MockProxy<LoadAdmissionProposal>
  let userPermissionRepoSpy: MockProxy<LoadUserPermission>
  let sut: DeclineAdmissionProposal
  let inputStub: DeclineAdmissionProposal.Input
  let userStub: User
  let admissionProposalStub: AdmissionProposal

  beforeAll(() => {
    userRepoSpy = mock()
    userStub = mockUser()
    userRepoSpy.load.mockResolvedValue(userStub)
    admissionProposalRepoSpy = mock()
    admissionProposalStub = mockAdmissionProposal()
    admissionProposalRepoSpy.load.mockResolvedValue(admissionProposalStub)
    userPermissionRepoSpy = mock()
    inputStub = {
      user: {
        id: userStub.id,
      },
      admissionProposal: {
        id: 'any_admission_proposal_id',
      },
    }
  })

  beforeEach(() => {
    sut = new DeclineAdmissionProposalUseCase(
      userRepoSpy,
      admissionProposalRepoSpy,
      userPermissionRepoSpy
    )
  })

  it('should call LoadUser with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: userStub.id })
  })

  it('should return UserNotFoundError if LoadUser returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)
    const expectedError = new UserNotFoundError(userStub.id)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedError)
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
      code: 'DECLINE_ADMISSION_PROPOSAL',
      status: PermissionStatus.GRANTED,
      grantToUserId: admissionProposalStub.userId,
      organizationId: admissionProposalStub.organizationId,
    })
  })

  it('should return UnauthorizedUserError if LoadUserPermission returns undefined', async () => {
    userPermissionRepoSpy.load.mockResolvedValueOnce(undefined)
    const expectedError = new UnauthorizedUserError(userStub.id, 'DECLINE_ADMISSION_PROPOSAL')

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedError)
  })
})
