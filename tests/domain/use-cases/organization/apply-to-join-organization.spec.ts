import {
  ApplyToJoinOrganization,
  ApplyToJoinOrganizationUseCase,
} from '@/domain/use-cases/organizations'
import {
  LoadAdmissionProposals,
  LoadOrganization,
  LoadUserAccount,
  SaveAdmissionProposal,
} from '@/domain/contracts/repos'
import {
  AlreadyAppliedToJoinOrganizationError,
  OrganizationNotFoundError,
  TheOrganizationOwnerCanNotApplyToJoinOrganizationError,
  UserAccountNotFoundError,
} from '@/domain/entities/errors'
import { ApplicationToJoinOrganizationSent } from '@/domain/events/organization'

import { mock, MockProxy } from 'jest-mock-extended'

describe('ApplyToJoinOrganizationUseCase', () => {
  let sut: ApplyToJoinOrganization
  let userAccountRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization>
  let admissionProposalRepoSpy: MockProxy<SaveAdmissionProposal & LoadAdmissionProposals>

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'))
    userAccountRepoSpy = mock()
    userAccountRepoSpy.load.mockResolvedValue({
      id: 'any_user_id',
      name: 'any_user_name',
      contacts: [],
      documents: [],
    })
    organizationRepoSpy = mock()
    organizationRepoSpy.load.mockResolvedValue({
      id: 'any_organization_id',
      name: 'any_organization_name',
      documents: [],
      ownerUser: {
        id: 'any_owner_user_id',
        contacts: [],
      },
    })
    admissionProposalRepoSpy = mock()
    admissionProposalRepoSpy.load.mockResolvedValue([])
    admissionProposalRepoSpy.save.mockResolvedValue({
      id: 'any_admission_proposal_id',
    })
  })

  beforeEach(() => {
    sut = new ApplyToJoinOrganizationUseCase(
      userAccountRepoSpy,
      organizationRepoSpy,
      admissionProposalRepoSpy
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
    organizationRepoSpy.load.mockResolvedValueOnce({
      id: 'any_organization_id',
      name: 'any_organization_name',
      documents: [],
      ownerUser: {
        id: 'any_user_id',
        contacts: [],
      },
    })

    const promise = sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    await expect(promise).rejects.toThrowError(
      new TheOrganizationOwnerCanNotApplyToJoinOrganizationError()
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
        id: 'any_user_id',
        name: 'any_user_name',
        documents: [],
        contacts: [],
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
    })
  })
})
