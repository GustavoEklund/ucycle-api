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
import { AdmissionProposalStatus, Organization } from '@/domain/entities/organization'
import { mockUser } from '@/tests/domain/mocks/entities'
import { User } from '@/domain/entities/user'

import { mock, MockProxy } from 'jest-mock-extended'
import { idText } from 'typescript'
import { mockAddress } from '@/../tests/infra/repos/postgres/mocks'

describe('ApplyToJoinOrganizationUseCase', () => {
  let sut: ApplyToJoinOrganizationUseCase
  let userAccountRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization>
  let admissionProposalRepoSpy: MockProxy<SaveAdmissionProposal & LoadAdmissionProposals>
  let organizationMemberRepoSpy: MockProxy<LoadOrganizationMember>
  let userMock: User

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-03-01T10:00:00'))
    userMock = mockUser()
    userAccountRepoSpy = mock()
    userAccountRepoSpy.load.mockResolvedValue(userMock)
    organizationRepoSpy = mock()
    organizationRepoSpy.load.mockResolvedValue(
      new Organization({
        id: 'any_organization_id',
        name: 'any_organization_name',
        address: mockAddress(),
        description: 'any description',
        userId: 'any_owner_user_id',
      })
    )
    admissionProposalRepoSpy = mock()
    admissionProposalRepoSpy.load.mockResolvedValue([])
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
    organizationRepoSpy.load.mockResolvedValueOnce(
      new Organization({
        id: 'any_organization_id',
        name: 'any_organization_name',
        address: mockAddress(),
        description: 'any description',
        userId: userMock.id,
      })
    )
    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(
      new TheOrganizationOwnerCanNotApplyToJoinOrganizationError()
    )
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
    organizationMemberRepoSpy.load.mockResolvedValueOnce({
      id: 'any_organization_id',
      firstName: 'any_user_name',
      lastName: 'any_user_last_name',
      documents: [],
      contacts: [],
    })

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(
      new AlreadyMemberOfOrganizationError('any_organization_id')
    )
  })

  it('should call LoadAdmissionProposal with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(admissionProposalRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.load).toHaveBeenCalledWith({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })
  })

  it('should throw AlreadyAppliedToJoinOrganizationError if user already applied to join organization', async () => {
    admissionProposalRepoSpy.load.mockResolvedValueOnce([
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
        id: 'any_organization_id',
        name: 'any_organization_name',
        ownerUser: {
          id: 'any_owner_user_id',
          contacts: [],
        },
      },
    })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy.mock.calls[0][0].equals(expectedEvent)).toBeTruthy()
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
