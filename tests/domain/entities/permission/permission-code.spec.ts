import { PermissionCode } from '@/domain/entities/permission/permission-code'
import { InvalidPermissionCodeError } from '@/domain/entities/errors'

describe('PermissionCode', () => {
  it('should throw InvalidPermissionCodeError when code is empty', () => {
    const expectedException = new InvalidPermissionCodeError('')

    const sut = () => new PermissionCode({ value: '' })

    expect(sut).toThrow(expectedException)
  })

  it('should throw InvalidPermissionCodeError when code has lower case letters', () => {
    const expectedException = new InvalidPermissionCodeError('abc')

    const sut = () => new PermissionCode({ value: 'abc' })

    expect(sut).toThrow(expectedException)
  })

  it('should throw InvalidPermissionCodeError when code has only numbers', () => {
    const expectedException = new InvalidPermissionCodeError('123')

    const sut = () => new PermissionCode({ value: '123' })

    expect(sut).toThrow(expectedException)
  })

  const symbols = Array.of('!@#$%^&*()_+-=[]{}|;:,./<>? ')

  it.each(symbols)(
    'should throw InvalidPermissionCodeError when code contains symbols',
    (symbol) => {
      const expectedException = new InvalidPermissionCodeError(`ABC${symbol}`)

      const sut = () => new PermissionCode({ value: `ABC${symbol}` })

      expect(sut).toThrow(expectedException)
    }
  )

  it('should throw InvalidPermissionCodeError when code has less than 3 chars', () => {
    const expectedException = new InvalidPermissionCodeError('AB')

    const sut = () => new PermissionCode({ value: 'AB' })

    expect(sut).toThrow(expectedException)
  })

  it('should throw InvalidPermissionCodeError when code has only underscores', () => {
    const expectedException = new InvalidPermissionCodeError('___')

    const sut = () => new PermissionCode({ value: '___' })

    expect(sut).toThrow(expectedException)
  })

  it('should throw InvalidPermissionCodeError when code begins with underscore', () => {
    const expectedException = new InvalidPermissionCodeError('_B1')

    const sut = () => new PermissionCode({ value: '_B1' })

    expect(sut).toThrow(expectedException)
  })

  it('should throw InvalidPermissionCodeError when code begins with number', () => {
    const expectedException = new InvalidPermissionCodeError('1_B')

    const sut = () => new PermissionCode({ value: '1_B' })

    expect(sut).toThrow(expectedException)
  })
})
