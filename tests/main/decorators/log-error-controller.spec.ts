import { LogErrorControllerDecorator } from '@/main/decorators'
import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'
import { SaveErrorLogRepository } from '@/domain/contracts/repos'
import { HttpResponse } from '@/application/helpers'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { ErrorLog } from '@/domain/entities/errors'

describe('LogErrorControllerDecorator', () => {
  let controllerSpy: MockProxy<Controller>
  let cryptoSpy: MockProxy<UUIDGenerator>
  let errorLogRepositorySpy: MockProxy<SaveErrorLogRepository>
  let sut: LogErrorControllerDecorator

  beforeAll(() => {
    controllerSpy = mock()
    cryptoSpy = mock()
    cryptoSpy.uuid.mockReturnValue('any_uuid')
    controllerSpy.handle.mockResolvedValue(HttpResponse.ok({ any: 'any_response' }))
    errorLogRepositorySpy = mock()
  })

  beforeEach(() => {
    sut = new LogErrorControllerDecorator(controllerSpy, cryptoSpy, errorLogRepositorySpy)
  })

  it('should call Controller with correct input', async () => {
    await sut.handle({ any: 'any' })

    expect(controllerSpy.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call SaveErrorLogRepository if Controller returns a server error', async () => {
    const expectedError = new Error('any_server_error')
    expectedError.stack = 'any_stack'
    const expectedErrorLog = new ErrorLog({
      id: 'any_uuid',
      code: 'SERVER_ERROR',
      message: 'server failed, try again soon',
      stack: 'any_stack',
    })
    controllerSpy.handle.mockResolvedValueOnce(HttpResponse.serverError(expectedError))

    await sut.handle({ any: 'any' })

    expect(errorLogRepositorySpy.save).toHaveBeenCalledTimes(1)
    expect(errorLogRepositorySpy.save).toHaveBeenCalledWith(expectedErrorLog)
  })

  it('should not call SaveErrorLogRepository if Controller returns a non server error', async () => {
    controllerSpy.handle.mockResolvedValueOnce(HttpResponse.ok({ any: 'any_other' }))

    await sut.handle({ any: 'any' })

    expect(errorLogRepositorySpy.save).not.toHaveBeenCalled()
  })

  it('should return the same output as Controller', async () => {
    const actualOutput = await sut.handle({ any: 'any' })

    expect(actualOutput).toEqual({
      statusCode: 200,
      data: { any: 'any_response' },
    })
  })
})
