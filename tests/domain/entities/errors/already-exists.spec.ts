import { AlreadyExistsError } from '@/domain/entities/errors'

describe('AlreadyExistsError', () => {
  let sut: AlreadyExistsError

  beforeEach(() => {
    sut = new AlreadyExistsError('any_id', 'any_entity')
  })

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error)
  })

  it('should return correct message', () => {
    expect(sut.message).toBe('any_entity with id any_id already exists')
  })

  it('should return correct name', () => {
    expect(sut.name).toBe('AlreadyExistsError')
  })
})
