import { Name, NameType } from '@/domain/value-objects'
import { InvalidNameError } from '@/domain/entities/errors'

describe('Name', () => {
  it('should throw InvalidNameError when name is empty', () => {
    const sut = () => new Name({ value: '' })

    expect(sut).toThrowError(new InvalidNameError(''))
  })

  it('should throw InvalidNameError when name is too short', () => {
    const sut = () => new Name({ value: 'any na' })

    expect(sut).toThrowError(new InvalidNameError('any na'))
  })

  it('should throw InvalidNameError when name is too long', () => {
    const sut = () => new Name({ value: 'a'.repeat(257) })

    expect(sut).toThrowError(new InvalidNameError('a'.repeat(257)))
  })

  it('should throw InvalidNameError when name has too few words', () => {
    const sut = () => new Name({ value: 'any' })

    expect(sut).toThrowError(new InvalidNameError('any'))
  })

  it('should set first name', () => {
    const sut = new Name({ value: 'any name' })

    expect(sut.first).toBe('any')
  })

  it('should set last name', () => {
    const sut = new Name({ value: 'any name' })

    expect(sut.last).toBe('name')
  })

  it('should set type', () => {
    const sut = new Name({ value: 'any name' })

    expect(sut.type).toBe(NameType.primary)
  })

  it('should set value', () => {
    const sut = new Name({ value: 'any name' })

    expect(sut.value).toBe('any name')
  })
})
