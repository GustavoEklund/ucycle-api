import { notFound, unauthorized } from '@/application/helpers'
import { NotFoundError, UnauthorizedError } from '@/application/errors'

describe('HttpHelpers', () => {
  describe('401 unauthorized', () => {
    it('should be a 401 UnauthorizedError', () => {
      const sut = unauthorized()

      expect(sut).toEqual({
        statusCode: 401,
        data: [new UnauthorizedError()],
      })
    })
  })

  describe('404 notFound', () => {
    it('should be generic NotFoundError if error is undefined', () => {
      const expectedError = new NotFoundError()

      const sut = notFound()

      expect(sut.data).toEqual([expectedError])
    })

    it('should be correct error when provided', () => {
      const expectedError = new Error('any_error')

      const sut = notFound([expectedError])

      expect(sut.data).toEqual([expectedError])
    })
  })
})
