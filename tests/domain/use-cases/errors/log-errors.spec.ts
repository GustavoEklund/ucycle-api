import { LogErrorsUseCase } from '@/domain/use-cases/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { SaveErrorLogRepository } from '@/domain/contracts/repos'
import { ErrorLog, Exception } from '@/domain/entities/errors'

class AnyError2 extends Exception {
  public constructor() {
    super('AnyError2', 'any_error_2')
    this.stack = 'any stack 2'
  }
}

describe('LogErrorsUseCase', () => {
  let cryptoSpy: MockProxy<UUIDGenerator>
  let errorLogRepositorySpy: MockProxy<SaveErrorLogRepository>
  let sut: LogErrorsUseCase
  let error1: Error
  let error2: AnyError2

  beforeAll(() => {
    errorLogRepositorySpy = mock()
  })

  beforeEach(() => {
    cryptoSpy = mock()
    cryptoSpy.uuid.mockReturnValueOnce('any_uuid_1').mockReturnValueOnce('any_uuid_2')
    sut = new LogErrorsUseCase(cryptoSpy, errorLogRepositorySpy)
    error1 = new Error('any_error_1')
    error1.name = 'AnyError1'
    error1.stack = 'any stack 1'
    error2 = new AnyError2()
  })

  it('should call UUIDGenerator with correct input for all errors', async () => {
    await sut.perform({
      user: { id: 'any_user_id' },
      errors: [error1, error2],
    })

    expect(cryptoSpy.uuid).toHaveBeenCalledTimes(2)
    expect(cryptoSpy.uuid).toHaveBeenCalledBefore(errorLogRepositorySpy.save)
  })

  it('should call SaveErrorLogRepository with correct input for all errors', async () => {
    await sut.perform({
      user: { id: 'any_user_id' },
      errors: [error1, error2],
    })

    expect(errorLogRepositorySpy.save).toHaveBeenNthCalledWith(
      1,
      new ErrorLog({
        id: 'any_uuid_1',
        code: 'AnyError1',
        message: 'any_error_1',
        stack: 'any stack 1',
        userId: 'any_user_id',
      })
    )
    expect(errorLogRepositorySpy.save).toHaveBeenNthCalledWith(
      2,
      new ErrorLog({
        id: 'any_uuid_2',
        code: 'ANY_ERROR2',
        message: 'any_error_2',
        stack: 'any stack 2',
        userId: 'any_user_id',
      })
    )
  })
})
