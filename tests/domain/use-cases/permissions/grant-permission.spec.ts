import { LoadUserAccount } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'
import { GrantPermissionUseCase } from '@/domain/use-cases/permissions'
import { UserAccountNotFoundError } from '@/domain/entities/errors'

describe('GrantPermissionUseCase', () => {
  let userRepo: MockProxy<LoadUserAccount>
  let sut: GrantPermissionUseCase

  beforeAll(() => {
    userRepo = mock()
    userRepo.load.mockResolvedValue({
      id: 'any_user_id',
      lastName: 'any_last_name',
      firstName: 'any_first_name',
      contacts: [],
      documents: [],
    })
  })

  beforeEach(() => {
    sut = new GrantPermissionUseCase(userRepo)
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut.perform({ userId: 'any_user_id', targetUserId: 'any_target_user_id' })

    expect(userRepo.load.mock.calls[0][0]).toEqual({ id: 'any_user_id' })
  })

  it('should return UserAccountNotFoundError if LoadUserAccount returns undefined', async () => {
    userRepo.load.mockResolvedValueOnce(undefined)

    const output = await sut.perform({ userId: 'any_user_id', targetUserId: 'any_target_user_id' })

    expect(output).toEqual(new UserAccountNotFoundError('any_user_id'))
  })

  it('should call LoadUserAccount with correct input for target user', async () => {
    await sut.perform({ userId: 'any_user_id', targetUserId: 'any_target_user_id' })

    expect(userRepo.load.mock.calls[1][0]).toEqual({ id: 'any_target_user_id' })
    expect(userRepo.load).toHaveBeenCalledTimes(2)
  })
})
