import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import {
  JoinUserToOrganization,
  JoinUserToOrganizationUseCase,
} from '@/domain/use-cases/organizations'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockOrganization, mockUser } from '@/tests/domain/mocks/entities'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { User } from '@/domain/entities/user'
import { Organization } from '@/domain/entities'

describe('JoinUserToOrganizationUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization & SaveOrganization>
  let sut: JoinUserToOrganizationUseCase
  let userStub: User
  let organizationStub: Organization
  let inputStub: JoinUserToOrganization.Input

  beforeAll(() => {
    inputStub = {
      admissionProposal: {
        id: 'any_admission_proposal_id',
        organization: { id: 'any_organization_id' },
        user: { id: 'any_user_id' },
      },
    }
    userRepoSpy = mock()
    userStub = mockUser()
    userRepoSpy.load.mockResolvedValue(userStub)
    organizationRepoSpy = mock()
    organizationStub = mockOrganization()
    organizationRepoSpy.load.mockResolvedValue(organizationStub)
  })

  beforeEach(() => {
    sut = new JoinUserToOrganizationUseCase(
      userRepoSpy,
      organizationRepoSpy,
      new Date('2021-03-01T10:00:00')
    )
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if LoadUserAccount returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })

  it('should call LoadOrganization with correct input', async () => {
    await sut.perform(inputStub)

    expect(organizationRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.load).toHaveBeenCalledWith({
      id: 'any_organization_id',
    })
  })

  it('should return OrganizationNotFoundError if LoadOrganization returns undefined', async () => {
    organizationRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new OrganizationNotFoundError('any_organization_id'))
  })

  it('should call SaveOrganization with correct input', async () => {
    const joinMemberSpy = jest.spyOn(organizationStub, 'joinMember')

    await sut.perform(inputStub)

    expect(joinMemberSpy).toHaveBeenCalledTimes(1)
    expect(joinMemberSpy).toHaveBeenCalledWith({
      userId: userStub.id,
      admissionProposalId: 'any_admission_proposal_id',
      date: new Date('2021-03-01T10:00:00'),
    })
    expect(organizationRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.save).toHaveBeenCalledWith(organizationStub)
    expect(joinMemberSpy).toHaveBeenCalledBefore(organizationRepoSpy.save)
  })

  it('should return undefined on success', async () => {
    const output = await sut.perform(inputStub)

    expect(output).toBeUndefined()
  })
})
