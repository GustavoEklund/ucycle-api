import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { LogErrorControllerDecorator } from '@/application/decorators'
import { LogErrors } from '@/domain/use-cases/errors'
import { DbTransaction } from '@/application/contracts'

describe('LogErrorControllerDecorator', () => {
  let controllerSpy: MockProxy<Controller>
  let logErrorsSpy: MockProxy<LogErrors>
  let dbTransactionSpy: MockProxy<DbTransaction>
  let sut: LogErrorControllerDecorator

  beforeAll(() => {
    controllerSpy = mock()
    controllerSpy.handle.mockResolvedValue(HttpResponse.ok({ any: 'any_response' }))
    logErrorsSpy = mock()
    dbTransactionSpy = mock()
  })

  beforeEach(() => {
    sut = new LogErrorControllerDecorator(controllerSpy, logErrorsSpy, dbTransactionSpy)
  })

  it('should call Controller with correct input', async () => {
    await sut.handle({ any: 'any' })

    expect(controllerSpy.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call DbTransaction if Controller returns a server error', async () => {
    const expectedError = new Error('any_server_error')
    controllerSpy.handle.mockResolvedValueOnce(HttpResponse.serverError(expectedError))

    await sut.handle({ any: 'any', userId: 'any_user_id' })

    expect(dbTransactionSpy.openTransaction).toHaveBeenCalledTimes(1)
    expect(dbTransactionSpy.commit).toHaveBeenCalledTimes(1)
    expect(dbTransactionSpy.closeTransaction).toHaveBeenCalledTimes(1)
  })

  const errorStub = new Error('any_error')
  errorStub.name = 'AnyName'
  errorStub.stack = 'any_stack'

  const httpResponsesWithError = [
    HttpResponse.badRequest([errorStub]),
    HttpResponse.unauthorized(),
    HttpResponse.forbidden([errorStub]),
    HttpResponse.notFound([errorStub]),
    HttpResponse.conflict([errorStub]),
  ]

  it.each(httpResponsesWithError)(
    'should call DbTransaction if Controller returns a client error',
    async (httpResponseWithError) => {
      controllerSpy.handle.mockResolvedValueOnce(httpResponseWithError)

      await sut.handle({ any: 'any', userId: 'any_user_id' })

      expect(dbTransactionSpy.openTransaction).toHaveBeenCalledTimes(1)
      expect(dbTransactionSpy.commit).toHaveBeenCalledTimes(1)
      expect(dbTransactionSpy.closeTransaction).toHaveBeenCalledTimes(1)
    }
  )

  it.each(httpResponsesWithError)(
    'should call LogErrors if Controller returns a client error',
    async (httpResponseWithError) => {
      controllerSpy.handle.mockResolvedValueOnce(httpResponseWithError)

      await sut.handle({ any: 'any', userId: 'any_user_id' })

      expect(logErrorsSpy.perform).toHaveBeenCalledTimes(1)
      expect(logErrorsSpy.perform).toHaveBeenCalledWith({
        user: { id: 'any_user_id' },
        errors: httpResponseWithError.data,
      })
    }
  )

  it('should not call DbTransaction if Controller returns a non server error', async () => {
    controllerSpy.handle.mockResolvedValueOnce(HttpResponse.ok({ any: 'any_other' }))

    await sut.handle({ any: 'any' })

    expect(dbTransactionSpy.openTransaction).not.toHaveBeenCalled()
    expect(dbTransactionSpy.commit).not.toHaveBeenCalled()
    expect(dbTransactionSpy.closeTransaction).not.toHaveBeenCalled()
  })

  it('should not call LogErrors if Controller returns a non server error', async () => {
    controllerSpy.handle.mockResolvedValueOnce(HttpResponse.ok({ any: 'any_other' }))

    await sut.handle({ any: 'any' })

    expect(logErrorsSpy.perform).not.toHaveBeenCalled()
  })

  it('should return the same output as Controller', async () => {
    const actualOutput = await sut.handle({ any: 'any' })

    expect(actualOutput).toEqual({
      statusCode: 200,
      data: { any: 'any_response' },
    })
  })
})
