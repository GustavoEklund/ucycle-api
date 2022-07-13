import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import { Organization } from '@/domain/entities'
import { OrganizationNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { User } from '@/domain/entities/user'
import { mock, MockProxy } from 'jest-mock-extended'
import { UpdateOrganizationUseCase } from '@/domain/use-cases/organizations'
import { mockUser } from '../../mocks/entities'
describe('UpdateOrganizationUseCase', () => {
  let userMock: User
  let organizationMock: Organization
  let userAccountRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization & SaveOrganization>
  let sut: UpdateOrganizationUseCase
  let input: {
    organization: {
      id: 'any_organization_id'
      name: 'any_organization_name'
      description: 'any_organization_description'
    }
    user: {
      id: 'any_user_id'
    }
  }

  beforeAll(() => {
    userMock = mockUser()
    userAccountRepoSpy = mock()
    userAccountRepoSpy.load.mockResolvedValue(userMock)
    organizationRepoSpy = mock()
    organizationRepoSpy.load.mockResolvedValue(organizationMock)
    input = {
      organization: {
        id: 'any_organization_id',
        name: 'any_organization_name',
        description: 'any_organization_description',
      },
      user: {
        id: 'any_user_id',
      },
    }
  })

  beforeEach(() => {
    sut = new UpdateOrganizationUseCase(organizationRepoSpy, userAccountRepoSpy)
  })

  it('should throw UserNotFoundError if user account not found', async () => {
    userAccountRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(input)

    expect(output).toEqual(new UserNotFoundError('any_user_id'))
  })

  it('should throw OrganizationNotFoundError if organization not found', async () => {
    organizationRepoSpy.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform(input)

    expect(output).toEqual(new OrganizationNotFoundError('any_organization_id'))
  })
})
