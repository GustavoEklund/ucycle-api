import { AuthenticationError } from '@/domain/entities/errors'

describe('AuthenticationError', () => {
  let sut: AuthenticationError

  beforeEach(() => {
    sut = new AuthenticationError()
  })

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error)
  })

  it('should return correct message', () => {
    expect(sut.message).toBe('authentication failed')
  })

  it('should return correct name', () => {
    expect(sut.name).toBe('AuthenticationError')
  })
})
