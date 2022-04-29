import { LoadMyOrganizationsUseCase } from '@/domain/use-cases'
import { LoadOrganizations } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

describe('LoadMyOrganizationsUseCase', () => {
  let userId: string
  let sut: LoadMyOrganizationsUseCase
  let organizationRepoSpy: MockProxy<LoadOrganizations>

  beforeAll(() => {
    userId = 'userId'
    organizationRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new LoadMyOrganizationsUseCase(organizationRepoSpy)
  })

  it('should call LoadOrganizations with correct input', async () => {
    await sut.perform({ userId })

    expect(organizationRepoSpy.loadAll).toHaveBeenCalledWith({ userId })
  })
})
