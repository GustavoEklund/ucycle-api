import { AdmissionProposalAccepted } from '@/domain/events/organization'
import { mockAdmissionProposal, mockOrganization, mockUser } from '@/tests/domain/mocks/entities'
import { LoadOrganization, LoadUserAccount } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'
import { AdmissionProposalAcceptedHandler } from '@/infra/event-handlers/admission-proposal-accepted'
import { User } from '@/domain/entities/user'
import { Mailer } from '@/domain/contracts/gateways'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { Organization } from '@/domain/entities'

describe('AdmissionProposalAcceptedHandler', () => {
  let mailerSpy: MockProxy<Mailer>
  let userRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization>
  let sut: AdmissionProposalAcceptedHandler
  let userStub: User
  let organizationStub: Organization
  let event: AdmissionProposalAccepted

  beforeAll(() => {
    mailerSpy = mock()
    userStub = mockUser()
    userRepoSpy = mock()
    userRepoSpy.load.mockResolvedValue(userStub)
    organizationRepoSpy = mock()
    organizationStub = mockOrganization()
    organizationRepoSpy.load.mockResolvedValue(organizationStub)
    event = new AdmissionProposalAccepted({
      admissionProposal: mockAdmissionProposal({ userId: userStub.id }),
      acceptedByUser: mockUser(),
    })
  })

  beforeEach(() => {
    sut = new AdmissionProposalAcceptedHandler(mailerSpy, userRepoSpy, organizationRepoSpy)
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.handle(event)

    expect(userRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.load).toHaveBeenCalledWith({ id: event.admissionProposal.userId })
  })

  it('should throw UserNotFoundError if LoadUserAccount returns undefined', async () => {
    userRepoSpy.load.mockResolvedValueOnce(undefined)

    const promise = sut.handle(event)

    await expect(promise).rejects.toThrow(new UserNotFoundError(userStub.id))
  })

  it('should call LoadOrganization with correct input', async () => {
    await sut.handle(event)

    expect(organizationRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(organizationRepoSpy.load).toHaveBeenCalledWith({
      id: event.admissionProposal.organizationId,
    })
  })

  it('should throw OrganizationNotFoundError if LoadOrganization returns undefined', async () => {
    const expectedError = new OrganizationNotFoundError(event.admissionProposal.organizationId)
    organizationRepoSpy.load.mockResolvedValueOnce(undefined)

    const promise = sut.handle(event)

    await expect(promise).rejects.toThrow(expectedError)
  })

  it('it should call Mailer with correct input', async () => {
    await sut.handle(event)

    expect(mailerSpy.sendWithTemplate).toHaveBeenCalledTimes(1)
    expect(mailerSpy.sendWithTemplate).toHaveBeenCalledWith({
      recipient: {
        email: userStub.account.getPrimaryEmail().value.address,
        name: userStub.account.name.value,
      },
      template: {
        id: 'd-edc111240ab4437388a38c9003298462',
        data: {
          organizationName: organizationStub.name,
        },
      },
    })
  })

  it('should throw if Mailer throws', async () => {
    mailerSpy.sendWithTemplate.mockRejectedValueOnce(new Error('any_infra_error'))

    const promise = sut.handle(event)

    await expect(promise).rejects.toThrow(new Error('any_infra_error'))
  })
})
