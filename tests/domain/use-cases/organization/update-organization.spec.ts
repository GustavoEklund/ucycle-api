import { LoadOrganization, LoadUserAccount, SaveOrganization } from '@/domain/contracts/repos'
import { Organization } from '@/domain/entities'
import {
  OrganizationNotFoundError,
  UnauthorizedUserError,
  UserNotFoundError,
} from '@/domain/entities/errors'
import { User } from '@/domain/entities/user'
import { mock, MockProxy } from 'jest-mock-extended'
import { UpdateOrganizationUseCase } from '@/domain/use-cases/organizations'
import { mockOrganization, mockUser } from '../../mocks/entities'

describe('UpdateOrganizationUseCase', () => {
  let userMock: User
  let organizationMock: Organization
  let userAccountRepoSpy: MockProxy<LoadUserAccount>
  let organizationRepoSpy: MockProxy<LoadOrganization & SaveOrganization>
  let sut: UpdateOrganizationUseCase
  let input: {
    organization: {
      id: string
      name: string
      description: string
    }
    user: {
      id: string
    }
  }

  beforeAll(() => {
    userMock = mockUser()
    organizationMock = mockOrganization({ ownerUserId: userMock.id })
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
  it('should call organizationRepo.save at least one time', async () => {
    await sut.perform(input)

    expect(organizationRepoSpy.save).toHaveBeenCalledTimes(1)
  })

  it('should throw UnauthorizedUserError if user is not the owner', async () => {
    organizationMock = mockOrganization({ ownerUserId: 'any_other_user_id' })
    organizationRepoSpy.load.mockResolvedValueOnce(organizationMock)

    const output = await sut.perform(input)

    expect(output).toEqual(new UnauthorizedUserError(input.user.id, 'UPDATE_ORGANIZATION'))
  })
})
