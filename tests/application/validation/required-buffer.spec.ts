import { RequiredFieldError } from '@/application/errors'
import { Required, RequiredBuffer } from '@/application/validation'

describe('RequiredBuffer', () => {
  it('should extend Required', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const errors = sut.validate()

    expect(errors).toEqual([new RequiredFieldError()])
  })

  it('should return an empty array if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })
})
