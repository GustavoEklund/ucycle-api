import { ApplyToJoinOrganizationUseCase } from '@/domain/use-cases/organizations'
import {
  LoadAdmissionProposals,
  LoadOrganization,
  LoadOrganizationMember,
  LoadUserAccount,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import {
  AlreadyAppliedToJoinOrganizationError,
  AlreadyMemberOfOrganizationError,
  OrganizationNotFoundError,
  TheOrganizationOwnerCanNotApplyToJoinOrganizationError,
  UserAccountNotFoundError,
} from '@/domain/entities/errors'
import { ApplicationToJoinOrganizationSent } from '@/domain/events/organization'
import {
  AdmissionProposalStatus,
  Organization,
  OrganizationMember,
} from '@/domain/entities/organization'
import { mockOrganization, mockUser } from '@/tests/domain/mocks/entities'
import { User } from '@/domain/entities/user'

import { mock, MockProxy } from 'jest-mock-extended'

describe('ApplyToJoinOrganizationUseCase', () => {
  let sut: ApplyToJoinOrganizationUseCase
  let userAccountRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization>
  let admissionProposalRepoSpy: MockProxy<SaveAdmissionProposal & LoadAdmissionProposals>
  let organizationMemberRepoSpy: MockProxy<LoadOrganizationMember>
  let userMock: User
  let organizationMock: Organization

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-03-01T10:00:00'))
    userMock = mockUser()
    userAccountRepoSpy = mock()
    userAccountRepoSpy.load.mockResolvedValue(userMock)
    organizationRepoSpy = mock()
    organizationMock = mockOrganization()
    organizationRepoSpy.load.mockResolvedValue(organizationMock)
    admissionProposalRepoSpy = mock()
    admissionProposalRepoSpy.loadAll.mockResolvedValue([])
    admissionProposalRepoSpy.save.mockResolvedValue({
      id: 'any_admission_proposal_id',
    })
    organizationMemberRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new ApplyToJoinOrganizationUseCase(
      userAccountRepoSpy,
      organizationRepoSpy,
      admissionProposalRepoSpy,
      organizationMemberRepoSpy
    )
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(userAccountRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should throw UserAccountNotFoundError if user account not found', async () => {
    userAccountRepoSpy.load.mockResolvedValueOnce(undefined)

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(new UserAccountNotFoundError('any_user_id'))
  })

  it('should call LoadOrganization with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(organizationRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.load).toHaveBeenCalledWith({ id: 'any_organization_id' })
  })

  it('should throw OrganizationNotFoundError if organization not found', async () => {
    organizationRepoSpy.load.mockResolvedValueOnce(undefined)

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(new OrganizationNotFoundError('any_organization_id'))
  })

  it('should throw TheOrganizationOwnerCanNotApplyToJoinOrganizationError if user is the owner of the organization', async () => {
    organizationRepoSpy.load.mockResolvedValueOnce(mockOrganization({ ownerUserId: userMock.id }))
    const expectedError = new TheOrganizationOwnerCanNotApplyToJoinOrganizationError()

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(expectedError)
  })

  it('should call LoadOrganizationMember with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(organizationMemberRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(organizationMemberRepoSpy.load).toHaveBeenCalledWith({
      user: { id: 'any_user_id' },
      organization: { id: 'any_organization_id' },
    })
  })

  it('should throw AlreadyMemberOfOrganizationError if user is member of organization', async () => {
    organizationMemberRepoSpy.load.mockResolvedValueOnce(
      new OrganizationMember({
        userId: 'any_user_id',
        joinDate: new Date('2022-03-01T10:00:00'),
        admissionProposalId: 'any_admission_proposal_id',
      })
    )

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(
      new AlreadyMemberOfOrganizationError('any_organization_id')
    )
  })

  it('should call LoadAdmissionProposal with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(admissionProposalRepoSpy.loadAll).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.loadAll).toHaveBeenCalledWith({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })
  })

  it('should throw AlreadyAppliedToJoinOrganizationError if user already applied to join organization', async () => {
    admissionProposalRepoSpy.loadAll.mockResolvedValueOnce([
      {
        id: 'any_admission_proposal_id',
        user: {
          id: 'any_user_id',
          name: 'any_user_name',
        },
        organization: {
          id: 'any_organization_id',
          name: 'any_organization_name',
        },
      },
    ])

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(
      new AlreadyAppliedToJoinOrganizationError('any_organization_id')
    )
  })

  it('should call notify with correct input', async () => {
    const expectedEvent = new ApplicationToJoinOrganizationSent({
      admissionProposalId: 'any_admission_proposal_id',
      user: {
        id: userMock.id,
        name: userMock.account.name.value,
        documents: userMock.account.documents,
        contacts: userMock.account.contacts,
      },
      organization: {
        id: organizationMock.id,
        name: organizationMock.name,
        ownerUser: {
          id: organizationMock.ownerUserId,
          contacts: [],
        },
      },
    })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenNthCalledWith(1, expectedEvent)
  })

  it('should call SaveAdmissionProposal with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(admissionProposalRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.save).toHaveBeenCalledWith({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
      status: AdmissionProposalStatus.pending,
    })
  })
})
