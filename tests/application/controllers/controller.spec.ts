import { Controller } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'
import { ValidationComposite } from '@/application/validation'

import { mocked } from 'ts-jest/utils'
import { DomainException } from '@/domain/entities/errors'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data',
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async perform(httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

class ErrorStub extends DomainException {
  constructor() {
    super('ErrorStub', 'any error message')
  }
}

describe('Controller', () => {
  let sut: ControllerStub
  let ValidationCompositeSpy: jest.Mock
  let validateSpy: jest.Mock

  beforeAll(() => {
    validateSpy = jest.fn().mockReturnValue([])
    ValidationCompositeSpy = jest.fn().mockImplementation(() => ({
      validate: validateSpy,
    }))
    mocked(ValidationComposite).mockImplementation(ValidationCompositeSpy)
  })

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 400 if validation fails', async () => {
    const errors = [new Error('validation_error')]
    validateSpy.mockReturnValueOnce(errors)

    const httpResponse = await sut.handle('any_value')

    expect(ValidationCompositeSpy).toHaveBeenCalledWith([])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: errors,
    })
  })

  it('should return 400 if perform throws a DomainException', async () => {
    const expectedError = new ErrorStub()
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(expectedError)

    const output = await sut.handle('any_value')

    expect(output).toEqual({
      statusCode: 400,
      data: [expectedError],
    })
  })

  it('should return 500 perform throws', async () => {
    const expectedError = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(expectedError)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: [new ServerError(expectedError)],
    })
  })

  it('should return 500 perform throws a non error object', async () => {
    jest.spyOn(sut, 'perform').mockRejectedValueOnce('perform_error')

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: [new ServerError()],
    })
  })

  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
