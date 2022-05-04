import {
  ApplyToJoinOrganization,
  ApplyToJoinOrganizationUseCase,
} from '@/domain/use-cases/organizations'
import { LoadUserAccount } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

describe('ApplyToJoinOrganizationUseCace', () => {
  let sut: ApplyToJoinOrganization
  let userAccountRepoSpy: MockProxy<LoadUserAccount>

  beforeAll(() => {
    userAccountRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new ApplyToJoinOrganizationUseCase(userAccountRepoSpy)
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', organizationId: 'any_organization_id' })

    expect(userAccountRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepoSpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })
})
