import { notFound } from '@/application/helpers'
import { NotFoundError } from '@/application/errors'

describe('HttpHelpers', () => {
  describe('notFound', () => {
    it('should return generic NotFoundError if error is undefined', () => {
      const expectedError = new NotFoundError()

      const sut = notFound()

      expect(sut.data).toEqual(expectedError)
    })

    it('should return correct error when provided', () => {
      const expectedError = new Error('any_error')

      const sut = notFound(expectedError)

      expect(sut.data).toEqual(expectedError)
    })
  })
})
