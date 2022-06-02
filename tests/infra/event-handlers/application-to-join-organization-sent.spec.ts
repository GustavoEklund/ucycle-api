import { ApplicationToJoinOrganizationSentHandler } from '@/infra/event-handlers'
import { mock, MockProxy } from 'jest-mock-extended'
import { Mailer } from '@/domain/contracts/gateways'
import { ApplicationToJoinOrganizationSent } from '@/domain/events/organization'
import { Email, EmailType } from '@/domain/value-objects/contact'
import { Document } from '@/domain/value-objects'

describe('ApplicationToJoinOrganizationSentHandler', () => {
  let sut: ApplicationToJoinOrganizationSentHandler
  let mailerSpy: MockProxy<Mailer>
  const event = new ApplicationToJoinOrganizationSent({
    admissionProposalId: 'any_admission_proposal_id',
    user: {
      id: 'any_user_id',
      name: 'any_user_name',
      documents: [new Document('342.444.198-88')],
      contacts: [new Email('any@mail.com', EmailType.primary)],
    },
    organization: {
      id: 'any_organization_id',
      name: 'any_organization_name',
      ownerUser: {
        id: 'any_owner_user_id',
        contacts: [new Email('any.other@mail.com', EmailType.primary)],
      },
    },
  })

  beforeAll(() => {
    mailerSpy = mock()
  })

  beforeEach(() => {
    sut = new ApplicationToJoinOrganizationSentHandler(mailerSpy)
  })

  it('it should call Mailer with correct input', async () => {
    await sut.handle(event)

    expect(mailerSpy.sendWithTemplate).toHaveBeenCalledTimes(1)
    expect(mailerSpy.sendWithTemplate).toHaveBeenCalledWith({
      recipient: {
        email: 'any.other@mail.com',
      },
      template: {
        id: 'd-e2679264028841579b0eb21a65e0a9d0',
        data: {
          userId: 'any_user_id',
          userName: 'any_user_name',
          userEmail: 'any@mail.com',
          organizationName: 'any_organization_name',
          admissionProposalId: 'any_admission_proposal_id',
        },
      },
    })
  })

  it('should not throw if Mailer throws', async () => {
    mailerSpy.sendWithTemplate.mockRejectedValueOnce(new Error('any_infra_error'))

    const promise = sut.handle(event)

    await expect(promise).resolves.toBeUndefined()
  })
})
