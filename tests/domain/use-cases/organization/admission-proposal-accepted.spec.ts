import { LoadOrganization, LoadUserAccount } from '@/domain/contracts/repos'
import { JoinUserToOrganizationUseCase } from '@/domain/use-cases/organizations'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockAdmissionProposal, mockUser } from '@/tests/domain/mocks/entities'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { User } from '@/domain/entities/user'

describe('JoinUserToOrganizationUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization>
  let sut: JoinUserToOrganizationUseCase
  let userStub: User

  beforeAll(() => {
    userRepoSpy = mock()
    userStub = mockUser()
    userRepoSpy.load.mockResolvedValue(userStub)
    organizationRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new JoinUserToOrganizationUseCase(userRepoSpy, organizationRepoSpy)
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
    const acceptedByUserStub = mockUser()
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: acceptedByUserStub,
    })

    const output = await sut.perform(event)

    expect(output).toEqual(new UserNotFoundError(acceptedByUserStub.id))
  })

  it('should call LoadOrganization with correct input', async () => {
    const admissionProposalStub = mockAdmissionProposal({ userId: userStub.id })
    const event = new AdmissionProposalAccepted({
      admissionProposal: admissionProposalStub,
      acceptedByUser: mockUser(),
    })

    await sut.perform(event)

    expect(organizationRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.load).toHaveBeenCalledWith({
      id: admissionProposalStub.organizationId,
    })
  })

  it('should return OrganizationNotFoundError if LoadOrganization returns undefined', async () => {
    organizationRepoSpy.load.mockResolvedValueOnce(undefined)
    const admissionProposalStub = mockAdmissionProposal({ userId: userStub.id })
    const event = new AdmissionProposalAccepted({
      admissionProposal: admissionProposalStub,
      acceptedByUser: mockUser(),
    })

    const output = await sut.perform(event)

    expect(output).toEqual(new OrganizationNotFoundError(admissionProposalStub.organizationId))
  })
})
