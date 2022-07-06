import { LoadUserAccount } from '@/domain/contracts/repos'
import { JoinUserToOrganizationUseCase } from '@/domain/use-cases/organizations'

import { mock, MockProxy } from 'jest-mock-extended'
import { mockAdmissionProposal, mockUser } from '@/tests/domain/mocks/entities'
import { AdmissionProposalAccepted } from '@/domain/events/organization'

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
    await sut.handle(event)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: event.admissionProposal.userId })
  })
})
