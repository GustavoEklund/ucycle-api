import { MaxFileSizeError } from '@/application/errors'
import { MaxFileSize } from '@/application/validation'

describe('MaxFileSize', () => {
  it('should return MaxFileSizeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(5.01 * 1024 * 1024))
    const sut = new MaxFileSize(5, invalidBuffer)

    const errors = sut.validate()

    expect(errors).toEqual([new MaxFileSizeError(5)])
  })

  it('should return an empty array if value is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(4.99 * 1024 * 1024))
    const sut = new MaxFileSize(5, validBuffer)

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })

  it('should return an empty array if value is equal to limit', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
    const sut = new MaxFileSize(5, validBuffer)

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })
})
