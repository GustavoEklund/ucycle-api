import { LoadUserAccount } from '@/domain/contracts/repos'
import { JoinUserToOrganizationUseCase } from '@/domain/use-cases/organizations'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockAdmissionProposal, mockUser } from '@/tests/domain/mocks/entities'
import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { UserNotFoundError } from '@/domain/entities/errors'

describe('JoinUserToOrganizationUseCase', () => {
  let userRepoSpy: MockProxy<LoadUserAccount>
  let sut: JoinUserToOrganizationUseCase

  beforeAll(() => {
    userRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new JoinUserToOrganizationUseCase(userRepoSpy)
  })

  it('should call LoadUserAccount with correct input', async () => {
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal(),
      acceptedByUser: mockUser(),
    })

    await sut.perform(event)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: event.admissionProposal.userId })
  })

  it('should return UserNotFoundError if LoadUserAccount returns undefined', async () => {
    userRepoSpy.load.mockResolvedValue(undefined)
    const acceptedByUserStub = mockUser()
    const event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal(),
      acceptedByUser: acceptedByUserStub,
    })

    const output = await sut.perform(event)

    expect(output).toEqual(new UserNotFoundError(acceptedByUserStub.id))
  })
})
