import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import { JoinUserToOrganizationUseCase } from '@/domain/use-cases/organizations'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockAdmissionProposal, mockOrganization, mockUser } from '@/tests/domain/mocks/entities'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { User } from '@/domain/entities/user'
import { Organization } from '@/domain/entities'

describe('JoinUserToOrganizationUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization & SaveOrganization>
  let sut: JoinUserToOrganizationUseCase
  let userStub: User
  let organizationStub: Organization

  beforeAll(() => {
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
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: mockUser(),
    })

    await sut.perform(event)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: event.admissionProposal.userId })
  })

  it('should return UserNotFoundError if LoadUserAccount returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: mockUser(),
    })

    const output = await sut.perform(event)

    expect(output).toEqual(new UserNotFoundError(event.acceptedByUser.id))
  })

  it('should call LoadOrganization with correct input', async () => {
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: mockUser(),
    })

    await sut.perform(event)

    expect(organizationRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.load).toHaveBeenCalledWith({
      id: event.admissionProposal.organizationId,
    })
  })

  it('should return OrganizationNotFoundError if LoadOrganization returns undefined', async () => {
    organizationRepoSpy.load.mockResolvedValueOnce(undefined)
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: mockUser(),
    })

    const output = await sut.perform(event)

    expect(output).toEqual(new OrganizationNotFoundError(event.admissionProposal.organizationId))
  })

  it('should call SaveOrganization with correct input', async () => {
    const joinMemberSpy = jest.spyOn(organizationStub, 'joinMember')
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: mockUser(),
    })

    await sut.perform(event)

    expect(joinMemberSpy).toHaveBeenCalledTimes(1)
    expect(joinMemberSpy).toHaveBeenCalledWith({
      userId: userStub.id,
      admissionProposalId: event.admissionProposal.id,
      date: new Date('2021-03-01T10:00:00'),
    })
    expect(organizationRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.save).toHaveBeenCalledWith(organizationStub)
  })
})
