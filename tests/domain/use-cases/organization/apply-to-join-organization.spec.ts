import {
  ApplyToJoinOrganization,
  ApplyToJoinOrganizationUseCase,
} from '@/domain/use-cases/organizations'
import { LoadOrganization, LoadUserAccount, SaveAdmissionProposal } from '@/domain/contracts/repos'
import { OrganizationNotFoundError, UserAccountNotFoundError } from '@/domain/entities/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('ApplyToJoinOrganizationUseCace', () => {
  let sut: ApplyToJoinOrganization
  let userAccountRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization>
  let admissionProposalRepoSpy: MockProxy<SaveAdmissionProposal>

  beforeAll(() => {
    userAccountRepoSpy = mock()
    userAccountRepoSpy.load.mockResolvedValue({
      id: 'any_user_id',
      name: 'any_user_name',
    })
    organizationRepoSpy = mock()
    organizationRepoSpy.load.mockResolvedValue({
      id: 'any_organization_id',
      name: 'any_organization_name',
    })
    admissionProposalRepoSpy = mock()
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

  it('should call SaveAdmissionProposal with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(admissionProposalRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(admissionProposalRepoSpy.save).toHaveBeenCalledWith({
      userId: 'any_user_id',
      organizationId: 'any_organization_id',
    })
  })
})
